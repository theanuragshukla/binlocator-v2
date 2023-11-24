import {Box, Button, Flex, Heading, Text, theme, useToast} from "@chakra-ui/react";
import CustomTextField from "../../../common/CustomTextFeld";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants.js";
import { login } from "../../../data/managers/account";
import { useState } from "react";
import binLoc from '../../../../public/Images/binLoc.svg'

export default function Login() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        const { status, msg } = await login(e);
        setLoading(false);
        if (status) {
            navigate(ROUTES.ACCOUNT);
            toast({
                status: "success",
                position: "top",
                title: "Logged in Successfully",
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

    const loginSchema = yup.object().shape({
        email: yup
            .string()
            .email("Enter a valid email")
            .required("Email is required"),
        password: yup
            .string()
            .max(128, "Password too long")
            .required("Enter a Password"),
    });

    const initialValues = {
        email: "",
        password: "",
    };

    const formik = useFormik({
        initialValues: initialValues,
        validateOnBlur: false,
        validateOnChange: false,
        validationSchema: loginSchema,
        onSubmit: handleSubmit,
    });
    return (
        <Flex justifyContent="center" alignItems="center"  height="90vh"
        >
        <Flex
            boxShadow='dark-lg'
            h="100%"
            sx={{width:{base:'95vw',sm:'55vw'}}}
            height="60%"

        >
            <Flex
                justify="center"
                alignItems="start"
                paddingLeft={50}
                flexDir="column"
                gap={4}
                bg="whiteAlpha.900"
                h="100%"
                width="80%"
            >

            <Heading>Login To Your Account</Heading>
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
                Don't have an account?
                <Link to={ROUTES.SIGNUP} style={{fontWeight:"700"}}>Signup here</Link>
            </Text>
            <Button
                isLoading={loading}
                loadingText="Please wait..."
                onClick={formik.handleSubmit}
                colorScheme="green"
                width={100}
            >
                Login
            </Button>
        </Flex>

            <Flex
                justify="center"
                bg="green.500"
                h="100%"
                width="30%"
            >
                <Flex
                    justify="center"
                    position="relative"
                    right="55%"
                    sx={{display:{base:"none",lg:"flex"}}}


                >
                   <img  width={1000} height={1000} src={binLoc}/>
            </Flex>


        </Flex>

            </Flex>
        </Flex>
    );
}
