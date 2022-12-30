import { useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, FormLabel, HStack, Input, VStack, Text } from "@chakra-ui/react"
import styles from "../styles/profile.module.scss"
import { useQueryClient } from "react-query";
import { IProfileUpdateBody, useMeQuery, useProfileUpdateMutation, UserRoutes } from "../utils/userApi";
import { useRouter } from "next/router";
import PlayerCard from "../components/PlayerCard";
import { useSession } from "next-auth/react";



const Profile = () => {

  return (
    <Layout>
      <VStack>
        <UserProfileForm />
        <PlayerCard rollType="role" />
      </VStack>
    </Layout>
  )

}

const UserProfileForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IProfileUpdateBody>();
  const queryClient = useQueryClient()
  const router = useRouter()
  const {data: session} = useSession()

  const { data: meQuery } = useMeQuery(session?.id)

  const profileUpdateMutation = useProfileUpdateMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(UserRoutes.ME)
    }
  })

  const [editing, setEditing] = useState(false)

  const onSubmit: SubmitHandler<IProfileUpdateBody> = data => {
    profileUpdateMutation.mutate(data)
    setEditing(false)
  };

  useEffect(() => {
    if (!meQuery?.success) {
      router.push("/")
    }
  }, [meQuery?.success, meQuery, router])

  if (meQuery?.user && editing) {
    return (

      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack>
          <Text fontSize='2xl'>Username: </Text>
          <Input className={styles.profileInput} defaultValue={meQuery.user.username || ""} {...register("username")} />
          <Button type='submit'>Save</Button>
        </HStack>
      </form>

    );
  }
  return (
    <HStack>
      <Text fontSize='2xl'>Username: </Text>
      <Text fontSize='2xl'>{meQuery?.user?.username}</Text>
      <Button onClick={() => { setEditing(true) }}>Edit</Button>
    </HStack>
  )
}



export default Profile