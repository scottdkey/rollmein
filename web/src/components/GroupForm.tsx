import { EditIcon } from "@chakra-ui/icons"
import { Button, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Switch, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { GroupRoutes, RollType, useCreateGroupMutation, useGroupQuery, useUpdateGroupMutation } from "../utils/groupApi"
import { useQueryClient } from "react-query"
import { useSession } from "next-auth/react"

export const GroupForm = ({ group }: { group?: IGroup }) => {
  const queryClient = useQueryClient()
  const { status } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [lockAfterOut, setLockAfterOut] = useState(false)
  const [membersCanUpdate, setMembersCanUpdate] = useState(false)
  const [rollType, setRollType] = useState(RollType.FFA)
  const [nameError, setNameError] = useState({
    error: false,
    message: ""
  })

  const createGroup = useCreateGroupMutation()
  const updateGroup = useUpdateGroupMutation()

  useEffect(() => {
    if (group) {
      setName(group.name)
      setLockAfterOut(group.lockAfterOut)
      setMembersCanUpdate(group.membersCanUpdate)
      setRollType(group.rollType)
    }
  }, [group])

  const nameInputValid = () => {
    if (name.length <= 1) {
      setNameError({
        error: true,
        message: "name must exist"
      })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    const data: ICreateGroup = {
      name,
      lockAfterOut,
      membersCanUpdate,
      rollType
    }
    const isNameValid = nameInputValid()
    if (isNameValid) {
      setNameError({
        error: false,
        message: ""
      })
    }


    if (isNameValid && group !== undefined) {
      await updateGroup.mutateAsync({ ...data, id: group.id }, {
        onSuccess: (data) => {
          if(data){
            queryClient.refetchQueries(`${GroupRoutes.GROUP}-${data.id}`)
            setModalOpen(false)
          }
        }
      })
    }
    if (isNameValid && group === undefined) {
      await createGroup.mutateAsync(data, {
        onSuccess: (data) => {
          if(data){
            queryClient.refetchQueries(`${GroupRoutes.GROUP}-${data.id}`)
            setModalOpen(false)
          }
        }
      })
    }

  }

  return (
    <>
      {group ?
        <IconButton disabled={status !== "authenticated"} onClick={() =>
          setModalOpen(true)
        } aria-label='Search database' icon={<EditIcon />} />
        :
        <Button disabled={status !== "authenticated"} onClick={() => setModalOpen(true)}>add a group</Button>
      }


      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={async (e) => {
          e.preventDefault()
          await handleSubmit()
        }}>
          <ModalOverlay />
          <ModalContent w='30'>
            <ModalHeader>{group ? group.name : "New Group"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody alignItems={'center'} alignContent='center'>
              <FormControl mb="4" isInvalid={nameError.error}>
                <FormLabel htmlFor="name">Group Name</FormLabel>
                <Input name="name" value={name} onChange={(e) => { setName(e.target.value) }} />
                <FormErrorMessage>{nameError.error && nameError.message}</FormErrorMessage>
              </FormControl>

              <RadioGroup onChange={(value: RollType) => {
                setRollType(value)
              }} value={rollType} alignItems='center'>
                <Stack direction="row">
                  <Radio value={RollType.FFA}>Free For All</Radio>
                  <Radio value={RollType.ROLE}>By Role</Radio>
                </Stack>
              </RadioGroup>

              <FormControl display='flex' alignItems='center' mt='2' mb='2'>
                <FormLabel htmlFor='member-change-setting' mb='0'>
                  Members can Make Changes
                </FormLabel>
                <Switch ml={'auto'} isChecked={membersCanUpdate} onChange={() => {
                  setMembersCanUpdate(!membersCanUpdate)
                }} />
              </FormControl>
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='lock-after-out-setting' mb='0'>
                  Lock After Out
                </FormLabel>
                <Switch ml={'auto'} isChecked={lockAfterOut} onChange={() => {
                  setLockAfterOut(!lockAfterOut)
                }} />
              </FormControl>

            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr="2" type="submit">Submit</Button>
              <Button colorScheme='red' onClick={() => {
                setModalOpen(false)
              }}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}