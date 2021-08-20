import { Box, Button, Grid } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { CreatePlayerMutation, useCreatePlayerMutation } from "../generated/graphql";
import { InputField } from "./InputField";
import { Sheild, Sword, Trash, OpenLock, Lock, FirstAid, Dice } from "../assets"

import { client } from "../lib/clients/graphqlRequestClient";

const NewPlayerCard = () => {
  const [player, setPlayer] = useState()
  const { mutate } = useCreatePlayerMutation<CreatePlayerMutation, Error>(client)




  return (
    <Formik
      initialValues={{ name: "", tank: false, healer: false, dps: false, inTheRoll: false, locked: false }}
      onSubmit={async (values, { setFieldError }) => {
        await mutate({
          input: { ...values },
        })

      }}>

      {({ isSubmitting }) => (
        <Box bg="GrayText">
          <Form>
            <InputField
              name="name"
              placeholder="player name"
              label="name"
            />
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              create player
            </Button>
            <Grid templateColumns="repeat(5, 1fr)">

              <Sword />
              <Sheild />
              <FirstAid />
            </Grid>

            <Dice />
            <Lock />
            <Trash />
          </Form>
        </Box>
      )}

    </Formik>

  )
}

export default NewPlayerCard