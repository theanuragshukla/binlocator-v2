import React, { useEffect, useState } from 'react';
import { Eye, EyeSlash } from 'iconsax-react';
import {
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Show,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { getIn } from 'formik';
import propTypes from 'prop-types'

function LeftLabelInput({
  name,
  formik,
  label,
  placeHolder,
  type,
  variant,
  required,
  labelWidth,
  fullWidth,
  children,
  value,
  onChange,
  readOnly,
  textLimit,
  maxLength,
  ...extras
}) {
  const { errors, touched } = formik;
  const [mobile] = useMediaQuery('(max-width: 768px)');
  return (
    <>
      <Show below="md">
        <CustomTextField
          required={required}
          type={type}
          name={name}
          label={label}
          formik={formik}
          placeHolder={placeHolder}
          variant={variant}
          readOnly={readOnly}
          fullWidth={fullWidth}
          onChange={onChange}
          value={value}
          textLimit={textLimit}
          maxLength={maxLength}
          {...extras}
        >
          {children}
        </CustomTextField>
      </Show>
      <Show above="md">
        <FormControl
          isRequired={required}
          isInvalid={getIn(touched, name) && getIn(errors, name)}
          maxW={mobile || fullWidth ? '100%' : '580px'}
        >
          <Grid templateColumns={`${labelWidth} 1fr`}>
            <GridItem>
              <FormLabel>{label}</FormLabel>
            </GridItem>
            <GridItem>
              <CustomTextField
                required={required}
                type={type}
                name={name}
                formik={formik}
                readOnly={readOnly}
                placeHolder={placeHolder}
                variant={variant}
                onChange={onChange}
                fullWidth={fullWidth}
                value={value}
                textLimit={textLimit}
                maxLength={maxLength}
                {...extras}
              >
                {children}
              </CustomTextField>
            </GridItem>
          </Grid>
        </FormControl>
      </Show>
    </>
  );
}

function CustomTextField({
  name,
  formik,
  label,
  placeHolder,
  type,
  variant,
  required,
  fullWidth,
  children,
  readOnly,
  onChange,
  value,
  textLimit,
  maxLength,
  ...extras
}) {
  const [mobile] = useMediaQuery('(max-width: 768px)');
  const [showPass, setshowPass] = useState(false);
  const { values, handleChange, errors, handleBlur } = formik;
  const [lengthRemains, setLengthRemains] = useState(maxLength);
  const finalValue = getIn(values, name) || value || '';

  const checkLimit = () => {
    setLengthRemains(() => maxLength - finalValue.length);
  };

  useEffect(checkLimit, [finalValue]);

  return (
    <FormControl
      isRequired={required}
      isInvalid={getIn(errors, name)}
      isReadOnly={readOnly}
      maxW={mobile || fullWidth ? '100%' : '400px'}
      {...extras}
    >
      {label ? <FormLabel>{label}</FormLabel> : null}
      <InputGroup>
        <Input
          type={showPass ? 'text' : type}
          _invalid={{ borderColor: '#d82d2d' }}
          variant={variant}
          value={value || getIn(values, name)}
          placeholder={placeHolder}
          onKeyDown={checkLimit}
          onChange={(x) => {
            checkLimit();
            if (
              !textLimit ||
              lengthRemains > 0 ||
              x.nativeEvent.inputType === 'deleteContentBackward'
            ) {
              handleChange(x);
              onChange(x);
            }
            checkLimit();
          }}
          onBlur={handleBlur}
          name={name}
          className="customInput"
        />
        {children}
        {type === 'password' && (
          <InputRightElement width="4.5rem">
            <IconButton
              color="primary"
              colorScheme="text"
              onClick={() => {
                setshowPass((show) => !show);
              }}
              icon={showPass ? <Eye size={18} /> : <EyeSlash size={18} />}
            />
          </InputRightElement>
        )}
      </InputGroup>
      {textLimit && (
        <Flex justify="flex-end">
          <Text fontSize={12}>{lengthRemains}</Text>
        </Flex>
      )}
    </FormControl>
  );
}

LeftLabelInput.defaultProps = {
  label: '',
  required: true,
  variant: 'null',
  name: '',
  type: 'text',
  formik: null,
  placeHolder: '',
  labelWidth: '180px',
  fullWidth: false,
  value: null,
  readOnly: false,
  onChange: () => {},
  textLimit: false,
  maxLength: 100,
};

LeftLabelInput.propTypes = {
  label: propTypes.string,
  required: propTypes.bool,
  placeHolder: propTypes.string,
  variant: propTypes.string,
  name: propTypes.string,
  type: propTypes.string,
  formik: propTypes.objectOf(propTypes.string),
  labelWidth: propTypes.string,
  fullWidth: propTypes.bool,
  children: propTypes.elementType.isRequired,
  value: propTypes.string,
  readOnly: propTypes.bool,
  onChange: propTypes.func,
  textLimit: propTypes.bool,
  maxLength: propTypes.number,
};

CustomTextField.defaultProps = {
  label: '',
  required: true,
  variant: 'null',
  name: '',
  type: 'text',
  formik: null,
  placeHolder: '',
  readOnly: false,
  fullWidth: false,
  value: null,
  onChange: () => {},
  textLimit: false,
  maxLength: 100,
};
CustomTextField.propTypes = {
  label: propTypes.string,
  required: propTypes.bool,
  placeHolder: propTypes.string,
  variant: propTypes.string,
  name: propTypes.string,
  type: propTypes.string,
  formik: propTypes.objectOf(propTypes.string),
  fullWidth: propTypes.bool,
  children: propTypes.elementType.isRequired,
  readOnly: propTypes.bool,
  onChange: propTypes.func,
  value: propTypes.string,
  textLimit: propTypes.bool,
  maxLength: propTypes.number,
};

export default CustomTextField;
export { LeftLabelInput };

