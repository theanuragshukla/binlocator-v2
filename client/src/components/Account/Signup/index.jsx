import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { ROUTES } from "../../../constants";
import CustomTextField from "../../../common/CustomTextFeld";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../../data/managers/account";
import { useState } from "react";

export default function Signup() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        passsword: "",
    };

    const signupSchema = yup.object().shape({
        firstName: yup
            .string("Enter a valid firstname")
            .min(1, "Firstname is too short")
            .max(50, "Firstname should be less than 50 characters")
            .required(),
        lastName: yup
            .string("Enter a valid lastname")
            .min(1, "Lastname is too short")
            .max(50, "lastName should be less than 50 characters"),
        email: yup
            .string()
            .email("Enter a valid email")
            .required("Email is required"),
        password: yup
            .string()
            .max(128, "Password too lomg")
            .required("Enter a Password"),
    });

    const handleSubmit = async (e) => {
        setLoading(true);
        const { status, msg } = await signup(e);
        setLoading(false);
        if (status) {
            navigate(ROUTES.ACCOUNT);
            toast({
                status: "success",
                position: "top",
                title: "Welcome Aboard",
                description: "Signup Up Sucessfull",
                isClosable: true,
            });
        } else {
            toast({
                status: "error",
                title: msg,
                isClosable: true,
            });
        }
    };
    const formik = useFormik({
        initialValues: initialValues,
        validateOnChange: false,
        validateOnBlur: false,
        validationSchema: signupSchema,
        onSubmit: handleSubmit,
    });
    return (
        <Flex
            justify="flex-start"
            alignItems={{ base: "flex-start" }}
            flexDir="column"
            pt={24}
            px={8}
            gap={4}
            bg="whiteAlpha.900"
            h="100%"
        >
            <Heading>Create an Account</Heading>
            <CustomTextField
                formik={formik}
                name="firstName"
                required
                variant="outline"
                label="First name"
                placeHolder="First name"
                textLimit
                maxLength={50}
            />
            <CustomTextField
                formik={formik}
                name="lastName"
                required={false}
                variant="outline"
                label="Last name"
                placeHolder="Last name"
                textLimit
                maxLength={50}
            />
            <CustomTextField
                formik={formik}
                name="email"
                required
                type="email"
                variant="outline"
                label="Email"
                placeHolder="Email"
            />
            <CustomTextField
                formik={formik}
                name="password"
                required
                type="password"
                variant="outline"
                label="Password"
                placeHolder="Password"
            />
            <Text>
                Already have an account?
                <Link to={ROUTES.LOGIN}>Login here</Link>
            </Text>
            <Button
                isLoading={loading}
                loadingText="Please Wait..."
                onClick={formik.handleSubmit}
                colorScheme="green"
            >
                Signup
            </Button>
        </Flex>
    );
}
