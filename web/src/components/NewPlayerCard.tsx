import { Box, Button, Grid } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { useCreatePlayerMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { InputField } from "./InputField";
import Tank from "../assets/images/TANK.png"
import Image from "next/image"
import Dps from "../assets/images/DPS.png"
import Healer from "../assets/images/HEALER.png"
import Dice from "../assets/svgs/Dice.svg"
import Lock from "../assets/svgs/Lock.svg"
// import OpenLock from "../assets/svgs/OpenLock.svg"
import Trash from "../assets/svgs/Trash.svg"

const NewPlayerCard = () => {
  useIsAuth()
  const [createPlayer] = useCreatePlayerMutation()

  const Icon = ({ src, alt, boxSize = "70" }: { src: StaticImageData, alt: string, boxSize?: string }) => {
    return (
      <Box boxSize={boxSize} borderRadius="full"><Image src={src} alt={alt}></Image></Box>
    )

  }

  return (
    <Formik
      initialValues={{ name: "", tank: false, healer: false, dps: false, inTheRoll: false, locked: false }}
      onSubmit={async (values, { setErrors }) => {
        const { errors } = await createPlayer({
          variables: { input: values },
          update: (cache) => {
            cache.evict({ fieldName: "posts:{}" });
          },
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
              <Icon src={Tank} alt="tank-icon" />
              <Icon src={Dps} alt="dps-icon" />
              <Icon src={Healer} alt="healer-icon" />
            </Grid>

            <Icon src={Dice} alt="dice-icon" />
            <Icon src={Lock} alt="lock-icon" />
            <Icon src={Trash} alt="trash-icon" boxSize="40px" />
          </Form>
        </Box>
      )}

    </Formik>

  )
}

export default NewPlayerCard