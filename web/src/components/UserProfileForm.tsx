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
        <div className="hStack">
          <text>Username: </text>
          <input className={styles.profileInput} defaultValue={`${meQuery.user.username}`} {...register("username")} />
          <button type='submit'>Save</button>
        </div>
      </form>

    );
  }
  return (
    <div className="hStack">
      <text>Username: </text>
      <text>{`${meQuery?.user?.username}`}</text>
      <button onClick={() => { setEditing(true) }}>Edit</button>
    </div>
  )
}

export default UserProfileForm