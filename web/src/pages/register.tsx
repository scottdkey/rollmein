import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import { setCookie } from "../utils/cookieHelpers";
import { AuthContext, useAuth } from "../providers/AuthProvider";
import { client } from "../lib/clients/graphqlRequestClient";

interface registerProps { }

const Register: React.FC<registerProps> = ({ }) => {
  const router = useRouter();
  const { mutate, data, } = useRegisterMutation(client);
  const { setAuth } = useAuth()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          await mutate({
            options: {
              ...values
            }
          },
          );
          if (data?.register.errors) {
            setErrors(toErrorMap(data.register.errors));
          } else if (data?.register.user) {
            // worked
            router.push("/");

            if (data.register.token) {
              setCookie(data.register.token, 5)
              setAuth(true)
            }
          }
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
  );
};

export default Register