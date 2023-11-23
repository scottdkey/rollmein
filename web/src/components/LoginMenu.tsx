import { signIn } from "next-auth/react"
import NextImage from "next/image"
import googleImage from "../assets/images/Google.svg"

const LoginMenu = () => {
  return (
    //alignContent={"center"} alignItems={"center"} width="100%" 
    <div >
      <OauthSignIn AuthType="google" image={googleImage} />
    </div >
  )
}
export default LoginMenu

function OauthSignIn(props: { AuthType: string, image: any, }) {

  const text = `Sign in with ${props.AuthType}`

  return (
    <>
      {/* width="100%" */}
      {/* alignItems={'center'} */}
      {/* verticalAlign={'center'} */}
      <button

        onClick={() => signIn(props.AuthType)}

      >
        {/* ml='-1' mt='2.5' mb='auto' mr='5' */}
        <div >
          {/* width="20rem" */}
          {/* height="20rem" */}
          <NextImage
            src={googleImage}
            alt={`${props.AuthType} logo`} />
        </div>
        {text}
      </button>
    </>
  )
}

function emailIsValidFormat(email: string) {
  const regex = new RegExp(/^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/)
  const isValid = regex.test(email)
  if (!isValid) {
    return false
  }
  return true
}