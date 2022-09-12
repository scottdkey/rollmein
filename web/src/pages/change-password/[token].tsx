import React, { useState } from "react";
import { NextPage } from "next";
import { Wrapper } from "../../components/Wrapper";
import { Formik, Form } from "formik";
import { toErrorMap } from "../../utils/toErrorMap";
import { InputField } from "../../components/InputField";
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { client } from "../../lib/clients/graphqlRequestClient";
import { Layout } from "../../components/Layout";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  // const { mutate, data } = useChangePasswordMutation<ChangePasswordMutation, Error>(client, {
  // })
  
  const [tokenError, setTokenError] = useState("");
  return (
    <Layout>
      {/*<Wrapper variant="small">*/}
      {/*  <Formik*/}
      {/*    initialValues={{ newPassword: "" }}*/}
      {/*    onSubmit={async (values, { setErrors }) => {*/}
      {/*      await mutate(*/}
      {/*        {*/}
      {/*          newPassword: values.newPassword,*/}
      {/*          token:*/}
      {/*            typeof router.query.token === "string"*/}
      {/*              ? router.query.token*/}
      {/*              : "",*/}
      {/*        });*/}
      {/*      if (data?.changePassword.errors) {*/}
      {/*        const errorMap = toErrorMap(data.changePassword.errors);*/}
      {/*        if ("token" in errorMap) {*/}
      {/*          setTokenError(errorMap.token);*/}
      {/*        }*/}
      {/*        setErrors(errorMap);*/}
      {/*      } else if (data?.changePassword.user) {*/}
      {/*        // worked*/}
      {/*        router.push("/");*/}
      {/*      }*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {({ isSubmitting }) => (*/}
      {/*      <Form>*/}
      {/*        <InputField*/}
      {/*          name="newPassword"*/}
      {/*          placeholder="new password"*/}
      {/*          label="New Password"*/}
      {/*          type="password"*/}
      {/*        />*/}
      {/*        {tokenError ? (*/}
      {/*          <Flex>*/}
      {/*            <Box mr={2} style={{ color: "red" }}>*/}
      {/*              {tokenError}*/}
      {/*            </Box>*/}
      {/*            <NextLink href="/forgot-password">*/}
      {/*              <Link>click here to get a new one</Link>*/}
      {/*            </NextLink>*/}
      {/*          </Flex>*/}
      {/*        ) : null}*/}
      {/*        <Button*/}
      {/*          mt={4}*/}
      {/*          type="submit"*/}
      {/*          isLoading={isSubmitting}*/}
      {/*          variantColor="teal"*/}
      {/*        >*/}
      {/*          change password*/}
      {/*        </Button>*/}
      {/*      </Form>*/}
      {/*    )}*/}
      {/*  </Formik>*/}
      {/*</Wrapper>*/}
    </Layout>
  );
};

export default ChangePassword;