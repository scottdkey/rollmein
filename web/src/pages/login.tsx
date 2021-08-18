import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument, LoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { setCookie } from "../utils/cookieHelpers";
import { useAuth } from "../providers/AuthProvider";
import { client } from "../lib/clients/graphqlRequestClient";



const Login: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const { mutate, data } = useLoginMutation<LoginMutation, Error>(client)
  const { setAuth } = useAuth()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async ({ usernameOrEmail, password }, { setErrors }) => {
          await mutate({
            usernameOrEmail,
            password
          },
          );
          if (data?.login.errors) {
            setErrors(toErrorMap(data.login.errors));
          } else if (data?.login.user) {
            router.push("/");

            if (data.login.token) {
              setCookie(data.login.token, 3)
              setAuth(true)
            }
          }
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