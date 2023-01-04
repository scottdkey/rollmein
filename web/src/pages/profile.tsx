import { VStack } from "@chakra-ui/react"
import PlayerCard from "../components/PlayerCard";
import { useSession } from "next-auth/react";
import UserProfileForm from "../components/UserProfileForm";
import { useMeQuery } from "../utils/userApi";
import { usePlayerFromSignedInUserQuery } from "../utils/playerApi";

const Profile = () => {
  const { data: session } = useSession()
  const { data: me } = useMeQuery()
  const { data: player } = usePlayerFromSignedInUserQuery()

  return (
    <>
      <VStack>
        <UserProfileForm props={{
          session, me: {
            user: me?.user || null,
            success: me?.success || false
          }
        }} />
        {player ? <PlayerCard rollType="role" id={player.id} userId={session?.user.id} profilePage={true} /> : null}
      </VStack>
    </>
  )

}



export default Profile


