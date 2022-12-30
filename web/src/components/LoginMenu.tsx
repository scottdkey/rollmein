import { Button, HStack, Input, VStack, Box, useToast } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import NextImage from "next/image"
import { useState } from "react"
import googleImage from "../assets/images/Google.svg"
import { useSession } from "next-auth/react"
const LoginMenu = () => {
  return (
    <VStack alignContent={"center"} alignItems={"center"} width="100%" >
      <OauthSignIn AuthType="google" image={googleImage} />
    </VStack >
  )
}
export default LoginMenu

function OauthSignIn(props: { AuthType: string, image: any, }) {

  const text = `Sign in with ${props.AuthType}`

  return (
    <>
      <Button
        onClick={() => signIn(props.AuthType)}
        width="100%"
        alignItems={'center'}
        verticalAlign={'center'}
      >
        <Box ml='-1' mt='2.5' mb='auto' mr='5'>
          <NextImage
            width="20rem"
            height="20rem"
            src={googleImage}
            alt={`${props.AuthType} logo`} />
        </Box>
        {text}
      </Button>
    </>
  )
}

function MagicLinkSignIn() {
  const [email, setEmail] = useState<string | null>()
  const [signInWithMagicLink, setSignInWithMagicLink] = useState(false)
  const [error, setError] = useState(false)
  const toast = useToast({
    position: 'top-right'
  })

  function checkEmailIsNotEmpty() {
    if (!email) {
      toast({
        title: 'must fill out field',
        description: 'email field was empty',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
      setError(true)
    }
  }

  function emailIsValidFormat(email: string) {
    const regex = new RegExp(/^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/)
    const isValid = regex.test(email)
    if (!isValid) {
      toast({
        title: 'email formatting',
        description: 'email seems incorrect, please check formatting',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
      return false
    }
    return true
  }

  async function signInRequest() {
    // if (email) {
    //   const { error } = await supabase.auth.signIn({
    //     email
    //   }, { shouldCreateUser: true })
    //   if (error) {
    //     toast({
    //       title: error.status,
    //       description: error.message,
    //       status: 'error',
    //       duration: 9000,
    //       isClosable: true
    //     })
    //     setError(true)
    //   }
    // if (!error) {
    //   toast({
    //     title: 'email sent',
    //     description: "please check your email to sign in",
    //     status: 'success',
    //     duration: 9000,
    //     isClosable: true
    //   })
    //   setError(false)
    //   setSignInWithMagicLink(false)

    // }
    // }
    return
  }

  async function magicLinkSignIn() {
    checkEmailIsNotEmpty()
    if (email && emailIsValidFormat(email)) {
      await signInRequest()
    }
  }
  function toggleOpen() {
    setSignInWithMagicLink(!signInWithMagicLink)
  }

  return (
    <>
      {signInWithMagicLink ? <>
        <Input isInvalid={error} onChange={(e) => { setEmail(e.target.value) }} />
        <HStack>
          <Button onClick={magicLinkSignIn} colorScheme="green">Submit</Button>
          <Button onClick={toggleOpen} colorScheme="red">Cancel</Button>
        </HStack>
      </> : null}
      <Button hidden={signInWithMagicLink !== false} onClick={toggleOpen}>Sign In With Magic Link</Button>
    </>
  )
}