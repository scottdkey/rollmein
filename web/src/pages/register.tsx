import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { setCookie } from "../utils/cookieHelpers";
import { useAuth } from "../providers/AuthProvider";
import { client } from "../lib/clients/graphqlRequestClient";
import { Layout } from "../components/Layout";

interface registerProps { }

const Register: React.FC<registerProps> = ({ }) => {
  const router = useRouter();
  const { setAuth } = useAuth()
  const { mutateAsync } = useRegisterMutation(client, {
    onSuccess: (data) => {
      if (data?.register.user) {
        // worked
        router.push("/");

        if (data.register.token) {
          setCookie(data.register.token, 5)
          setAuth(true)
        }
      }
    }
  });

  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            await mutateAsync({
              options: {
                ...values
              }
            }).then(res => {
              if (res.register.errors) {
                setErrors(toErrorMap(res.register.errors));
              }
            });

          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4}>
                <InputField name="email" placeholder="email" label="Email" />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default Register