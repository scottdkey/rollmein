import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout as Layout } from '../components/Layout';
import { CreatePlayerMutation, useCreatePlayerMutation } from '../generated/graphql';
import { client } from '../lib/clients/graphqlRequestClient';
import { useQueryClient } from 'react-query';
import { useAuth } from '../providers/AuthProvider';



const CreatePlayer: React.FC<{}> = ({ }) => {
  const queryClient = useQueryClient()
  const { auth } = useAuth()
  const router = useRouter()
  const { mutate } = useCreatePlayerMutation<CreatePlayerMutation, Error>(client,
    {
      onSuccess: (data, _variables, _context) => {
        queryClient.invalidateQueries("GetAllPlayers")
      }

    })
  return (

    <Layout variant="small">
      <Formik
        initialValues={{ name: "", tank: false, healer: false, dps: false, inTheRoll: false, locked: false }}
        onSubmit={async (values, { setErrors }) => {
          await mutate({ input: values })
          if (!auth) {
            Router.push("/")
          } else {
            // setErrors(error)
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

export default CreatePlayer;