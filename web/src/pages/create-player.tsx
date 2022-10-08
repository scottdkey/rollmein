import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout as Layout } from '../components/Layout';
import { useQueryClient } from 'react-query';
import { useAuth } from '../providers/AuthProvider';



const CreatePlayer: React.FC<{}> = ({ }) => {
  const queryClient = useQueryClient()
  const { auth } = useAuth()
  const router = useRouter()
  return (

    <Layout variant="small">
      <Formik
        initialValues={{ name: "", tank: false, healer: false, dps: false, inTheRoll: false, locked: false }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values)

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