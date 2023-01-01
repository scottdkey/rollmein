import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GroupForm } from "../../components/GroupForm";
import { useGroupQuery } from "../../utils/groupApi";
import { Layout } from "../../components/Layout";


export default function Group() {
  const router = useRouter()
  const params = router.query

  const id = params.id as string
  const { data, isLoading, isError } = useGroupQuery(id)


  if (!data && isLoading) {
    return (
      <>
        loading
      </>
    )
  }
  if (isError) {
    return (
      <>
        error occurred
      </>
    )
  }
  return (
    <>
      {JSON.stringify(data)}
      <Heading size={'xl'}>{data?.name}</Heading>
      <Heading size={'l'}>RollType: {data?.rollType === 'ffa' ? 'Free For All' : 'By Role'}</Heading>
      <GroupForm group={data} />
    </>
  )
}