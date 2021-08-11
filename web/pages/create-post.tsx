import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import Router from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout as Layout } from '../components/Layout';
import { useCreatePlayerMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';



const CreatePost: React.FC<{}> = ({ }) => {
  useIsAuth()
  const [, createPlayer] = useCreatePlayerMutation()
  return (

    <Layout variant="small">
      <Formik
        initialValues={{ name: "", tank: false, healer: false, dps: false, inTheRoll: false, locked: false }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPlayer({ input: values })
          if (!error) {
            Router.push("/")
          } else {
            setErrors(error)
          }

        }}>

        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                name="text"
                placeholder="text..."
                label="Body"
                textArea={true}
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout >
  )
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost)