import { Button, HStack, Input, Text } from "@chakra-ui/react"
import { UserRoutes } from "../types/UserRoutes.enum"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useQueryClient } from "react-query"
import styles from "../styles/profile.module.scss"
import { useMeQuery, useProfileUpdateMutation } from "../utils/userApi"

const UserProfileForm = () => {

  const queryClient = useQueryClient()

  const { data: meQuery, refetch } = useMeQuery()
  const { register, handleSubmit, setValue } = useForm<IProfileUpdateBody>({
    defaultValues: {
      username: meQuery?.user?.username || ""
    }
  });

  useEffect(() => {
    if (meQuery && meQuery.user && meQuery.user.username) {
      setValue('username', meQuery.user.username)
      queryClient.setQueryData(UserRoutes.ME, meQuery)
    }

  }, [meQuery, setValue, queryClient])



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