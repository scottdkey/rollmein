import { EditIcon } from "@chakra-ui/icons"
import { Button, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Switch } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useCreateGroup, useGetGroup, useUpdateGroup } from "../../utils/group.api"
import { ICreateGroup, IGroup, IUpdateGroup } from "../../types/Group"
import { RollType } from "../../types/RollType.enum"

export const GroupForm = ({ group }: { group?: IGroup }) => {
  const [modalOpen, setModalOpen] = useState(false)


  const { status } = useSession()

  const [name, setName] = useState("")
  const [lockAfterOut, setLockAfterOut] = useState(false)
  const [membersCanUpdate, setMembersCanUpdate] = useState(false)
  const [rollType, setRollType] = useState(RollType.FFA)
  const updateGroup = useUpdateGroup()
  const createGroup = useCreateGroup()
  const { isLoading, isError, data } = useGetGroup({ groupId: group?.id ?? null })

  const [nameError, setNameError] = useState({
    error: false,
    message: ""
  })

  const resetCard = (group?: IGroup | null) => {
    if (group) {
      setName(group.name)
      setLockAfterOut(group.lockAfterOut)
      setMembersCanUpdate(group.membersCanUpdate)
      setRollType(group.rollType)
      setModalOpen(false)
    }
  }

  useEffect(() => {
    resetCard(group)
  }, [group])

  useEffect(() => {
    resetCard(data)
  }, [data])


  const nameInputValid = () => {
    if (name && name.length <= 1) {
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


    if (isNameValid && group && group.id && group.name) {
      const groupUpdate: IUpdateGroup = {
        ...data,
        id: group.id
      }
      const res = await updateGroup.mutateAsync({
        group: groupUpdate
      })
      if (res) {

      }
      setModalOpen(false)
    }
    if (isNameValid && group === undefined) {
      const groupCreate: ICreateGroup = {
        ...data
      }
      await createGroup.mutateAsync({
        group: groupCreate,
      })
      setModalOpen(false)
      resetCard()
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