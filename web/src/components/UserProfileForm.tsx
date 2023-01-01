import { HStack, Input, Button, Text } from "@chakra-ui/react"
import { Session } from "next-auth"
import { useSession, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useQueryClient } from "react-query"
import { ScrubbedUser } from "../../../api/src/types/User"
import styles from "../styles/profile.module.scss"
import { IProfileUpdateBody, useMeQuery, useProfileUpdateMutation, UserRoutes, getMe } from "../utils/userApi"

interface IMe {
  user: ScrubbedUser | null
  success: boolean
}

interface UserProfileFormProps {
  props: {
    session: Session | null
    me: IMe
  }
}

const UserProfileForm = ({ props }: UserProfileFormProps) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IProfileUpdateBody>();
  const queryClient = useQueryClient()
  const router = useRouter()
  const { status } = useSession()

  const { data: meQuery, refetch } = useMeQuery({
    initialData: props.me
  })



  const profileUpdateMutation = useProfileUpdateMutation({
    onSuccess: async () => {
      queryClient.invalidateQueries(UserRoutes.ME)
      await refetch()
    }
  })

  const [editing, setEditing] = useState(false)

  const onSubmit: SubmitHandler<IProfileUpdateBody> = data => {

    profileUpdateMutation.mutate(data)
    setEditing(false)
  };

  useEffect(() => {
    if (status !== "authenticated") {
      router.push("/")
    }
  }, [meQuery?.success, meQuery, router, status])

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

export async function getServerSideProps(context: any): Promise<UserProfileFormProps> {
  // Fetch data from external API
  const session = await getSession(context)
  const sessionToken = session?.id as string
  const me = await getMe(sessionToken)

  // Pass data to the page via props
  return {
    props: {
      session,
      me
    }

  }
}

export default UserProfileForm