import { VStack } from "@chakra-ui/react"
import PlayerCard from "../components/PlayerCard";
import { useSession } from "next-auth/react";
import UserProfileForm from "../components/UserProfileForm";
import { useMeQuery } from "../utils/userApi";

const Profile = () => {
  const { data: session } = useSession()
  const { data: me } = useMeQuery()

  return (
    <>
      <VStack>
        <UserProfileForm props={{
          session, me: {
            user: me?.user || null,
            success: me?.success || false
          }
        }} />
        <PlayerCard rollType="role" userId={session?.user.id} />
      </VStack>
    </>
  )

}



export default Profile


