import { EditIcon } from "@chakra-ui/icons"
import { Button, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Switch } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useGroupSlice } from "../../stores/Group.slice"
import { RollType, useCreateGroup, useGetGroup, useUpdateGroup } from "../../utils/group.api"
import { ICreateGroup, IGroup, IUpdateGroup } from "../../types/Group"

export const GroupForm = (params: { group?: IGroup }) => {
  const { status, data: session } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const groups = useGroupSlice(state => state.groups)
  const group = useGroupSlice(state => state.groups.find(group => group.id === params.group?.id))
  const setGroups = useGroupSlice(state => state.setGroups)

  const { } = useGetGroup({
    groupId: params.group?.id
  })
  const [lockAfterOut, setLockAfterOut] = useState(false)
  const [membersCanUpdate, setMembersCanUpdate] = useState(false)
  const [rollType, setRollType] = useState(RollType.FFA)
  const updateGroup = useUpdateGroup()
  const createGroup = useCreateGroup()

  const [nameError, setNameError] = useState({
    error: false,
    message: ""
  })

  useEffect(() => {
    if (group) {
      setName(group.name)
      setLockAfterOut(group.lockAfterOut)
      setMembersCanUpdate(group.membersCanUpdate)
      setRollType(group.rollType)
      setModalOpen(false)
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
    const sessionToken = session?.id


    if (isNameValid && group && group.id && sessionToken) {
      const groupUpdate: IUpdateGroup = {
        ...data,
        id: group.id
      }
      await updateGroup.mutateAsync({
        group: groupUpdate
      })
    }
    if (isNameValid && group === undefined && sessionToken) {
      const groupCreate: ICreateGroup = {
        ...data
      }
      await createGroup.mutateAsync({
        group: groupCreate,
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