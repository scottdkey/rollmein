import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout as Layout } from '../components/Layout';
import { useCreatePlayerMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';



const CreatePlayer: React.FC<{}> = ({ }) => {
  const router = useRouter()
  useIsAuth()
  const [createPlayer] = useCreatePlayerMutation()
  return (

    <Layout variant="small">
      <Formik
        initialValues={{ name: "", tank: false, healer: false, dps: false, inTheRoll: false, locked: false }}
        onSubmit={async (values, { setErrors }) => {
          const { errors } = await createPlayer({
            variables: { input: values }, update: (cache) => {
              cache.evict({ fieldName: "posts:{}" })
            }
          })
          if (!errors) {
            Router.push("/")
          } else {
            console.log(errors)
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

export default withApollo({ ssr: false })(CreatePlayer);