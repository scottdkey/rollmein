import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation, LoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { setCookie } from "../utils/cookieHelpers";
import { useAuth } from "../providers/AuthProvider";
import { client } from "../lib/clients/graphqlRequestClient";
import { useQueryClient } from "react-query";


const Login: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const queryClient = useQueryClient()
  const { setAuth } = useAuth()
  const { mutateAsync } = useLoginMutation<LoginMutation, Error>(client, {
    onSuccess: async (data) => {

      router.replace("/")

    },
  })


  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          enableReinitialize
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async ({ usernameOrEmail, password }, { setFieldError }) => {
            await mutateAsync({
              usernameOrEmail,
              password
            }).then(async (data) => {
              if (data.login.token) {
                setCookie(data.login.token, 3)
                await queryClient.refetchQueries({ stale: true })
                setAuth(true)
              }

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
    </Layout>
  );
};

export default Login