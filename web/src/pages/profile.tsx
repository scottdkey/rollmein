import { VStack } from "@chakra-ui/react"
import PlayerCard from "../components/Player/PlayerCard";
import { getSession, useSession } from "next-auth/react";
import UserProfileForm from "../components/UserProfileForm";

import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSignedInUserPlayer } from "../utils/player.api";

const Profile = (props: PageProps) => {
  const [player, setPlayer] = useState<IPlayer | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (player === null && session && session.id) {
      getSignedInUserPlayer(session.id).then(res => {
        if (res) {
          setPlayer(res)
        }

      })
    }
    if (props.sessionToken === null) {
      router.push("/")
    }
  }, [router, props, player])
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


