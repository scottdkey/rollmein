import { VStack } from "@chakra-ui/react"
import PlayerCard from "../components/Player/PlayerCard";
import { useSession } from "next-auth/react";
import UserProfileForm from "../components/UserProfileForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSignedInUserPlayer, useGetSignedInUserPlayer } from "../utils/player.api";

const Profile = () => {
  const {data: player} = useGetSignedInUserPlayer()
  const router = useRouter()
  const {data: session} = useSession()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [user, setUser] = useState<ScrubbedUser | null>(null)

  useEffect(() => {
    if(session){
      setSessionToken(session.id)
      setUser(session.user)
    }

    if (!session) {
      router.push("/")
    }
  }, [router, session])


  if (user && user.id && user.username) {
    return (
      <>
        <VStack>
          {sessionToken ?
            <UserProfileForm /> : null}
          {player ? <PlayerCard rollType="role" id={player.id} userId={user.id} profilePage={true} /> : null}
        </VStack>
      </>
    )
  }
  return <>error loading</>

}


export default Profile


