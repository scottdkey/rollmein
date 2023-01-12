import { HStack, Input, Button, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useQueryClient } from "react-query"
import styles from "../styles/profile.module.scss"
import { IProfileUpdateBody, useMeQuery, useProfileUpdateMutation, UserRoutes } from "../utils/userApi"

const UserProfileForm = ({ id, sessionToken }: {
  id: string,
  sessionToken: string,
}) => {

  const queryClient = useQueryClient()

  const { data: meQuery, refetch } = useMeQuery({
    onSuccess: (data) => {
      if (data.user?.username) {
        setValue("username", data.user?.username)
      }
      queryClient.setQueryData(UserRoutes.ME, data)
    }
  })
  const { register, handleSubmit, setValue } = useForm<IProfileUpdateBody>({
    defaultValues: {
      username: meQuery?.user?.username || ""
    }
  });



  const profileUpdateMutation = useProfileUpdateMutation()

  const [editing, setEditing] = useState(false)

  const onSubmit: SubmitHandler<IProfileUpdateBody> = data => {

    profileUpdateMutation.mutate(data, {
      onSuccess: async () => {
        queryClient.invalidateQueries(UserRoutes.ME)
        await refetch()
      }
    })
    setEditing(false)
  };

  if (meQuery?.user && editing) {
    return (

      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack>
          <Text fontSize='2xl'>Username: </Text>
          <Input className={styles.profileInput} defaultValue={`${meQuery.user.username}`} {...register("username")} />
          <Button type='submit'>Save</Button>
        </HStack>
      </form>

    );
  }
  return (
    <HStack>
      <Text fontSize='2xl'>Username: </Text>
      <Text fontSize='2xl'>{`${meQuery?.user?.username}`}</Text>
      <Button onClick={() => { setEditing(true) }}>Edit</Button>
    </HStack>
  )
}

export default UserProfileForm