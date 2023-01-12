import { VStack } from "@chakra-ui/react"
import PlayerCard from "../components/PlayerCard";
import { getSession } from "next-auth/react";
import UserProfileForm from "../components/UserProfileForm";
import { usePlayerFromSignedInUserQuery } from "../utils/playerApi";
import { GetServerSideProps } from "next";
import { ScrubbedUser } from "../../../api/src/types/User";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Profile = (props: PageProps) => {
  const { data: player } = usePlayerFromSignedInUserQuery()
  const router = useRouter()

  useEffect(() => {
    if (props.sessionToken === null) {
      router.push("/")
    }
  }, [router, props])
  if (props.user?.id && props.user.username) {
    return (
      <>
        <VStack>
          {props.sessionToken ? 
          <UserProfileForm id={props.user.id} sessionToken={props.sessionToken} /> : null}
          {player ? <PlayerCard rollType="role" id={player.id} userId={props.user?.id} profilePage={true} /> : null}
        </VStack>
      </>
    )
  }
  return <>error loading</>

}

interface PageProps {
  user: ScrubbedUser | null
  session: Session | null
  sessionToken: string | null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const props: PageProps = {
    user: session?.user ? session.user : null,
    session,
    sessionToken: session?.id ? session.id : null
  }

  return { props }
}


export default Profile


