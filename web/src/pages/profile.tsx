import { useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, FormLabel, HStack, Input, TagLabel, VStack, Text } from "@chakra-ui/react"
import styles from "../styles/profile.module.scss"
import { useQuery, useQueryClient } from "react-query";
import { ApiRequest, RestMethods } from "../utils/Rollmein.api";
import { IProfileUpdateBody, useMeQuery, useProfileUpdateMutation, UserRoutes } from "../utils/userApi";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/router";



const Profile = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IProfileUpdateBody>();
  const queryClient = useQueryClient()
  const {setUser} = useAuth()
  const router = useRouter()

  const { data: user } = useMeQuery()

  const profileUpdateMutation = useProfileUpdateMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(UserRoutes.ME)
      setUser(data)

    }
  })

  const [editing, setEditing] = useState(false)

  const onSubmit: SubmitHandler<IProfileUpdateBody> = data => {
    profileUpdateMutation.mutate(data)
    setEditing(false)
  };

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user])

  if (user && editing) {
    return (
      <Layout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <HStack>
              <FormLabel>Username: </FormLabel>
              <Input className={styles.profileInput} defaultValue={user.username || ""} {...register("username")} />
            </HStack>

            <Button type='submit'>Save</Button>
          </VStack>
        </form>
      </Layout>
    );
  }
  return (
    <Layout>
      <VStack>
        <HStack>
          <Text fontSize='2xl'>Username: </Text>
          <Text fontSize='2xl'>{user?.username}</Text>
          <Button onClick={() => { setEditing(true) }}>Edit</Button>
        </HStack>
      </VStack>
    </Layout>
  )

}



export default Profile