import React, { useState } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument, LoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { setCookie } from "../utils/cookieHelpers";
import { useAuth } from "../providers/AuthProvider";
import { client } from "../lib/clients/graphqlRequestClient";
import { toErrorMap } from "../utils/toErrorMap";

const Login: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const { setAuth } = useAuth()
  const { mutateAsync } = useLoginMutation<LoginMutation, Error>(client, {
    onSuccess: (data) => {
      if (data.login.token) {
        setCookie(data.login.token, 3)
        router.replace("/")
        setAuth(true)
      }

    },
  })


  return (
    <Wrapper variant="small">
      <Formik
        enableReinitialize
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async ({ usernameOrEmail, password }, { setFieldError }) => {
          await mutateAsync({
            usernameOrEmail,
            password
          }).then((data) => {
            if (data.login.errors) {
              data.login.errors.forEach(error => {
                setFieldError(error.field, error.message)
              });
            }

          }).catch(err => {
            console.log("error: unknown", err)
          })




        }}

      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login