import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import CustomTextField from "../../../common/CustomTextFeld";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants.js";
import { login } from "../../../data/managers/account";
import { useState } from "react";

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
        <Flex
            justify="flex-start"
            alignItems={{ base: "flex-start" }}
            flexDir="column"
            pt={32}
            px={8}
            gap={4}
            bg="whiteAlpha.900"
            h="100%"
        >
            <Heading>Login</Heading>
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
                <Link to={ROUTES.SIGNUP}>Signup here</Link>
            </Text>
            <Button
                isLoading={loading}
                loadingText="Please wait..."
                onClick={formik.handleSubmit}
                colorScheme="green"
            >
                Login
            </Button>
        </Flex>
    );
}
