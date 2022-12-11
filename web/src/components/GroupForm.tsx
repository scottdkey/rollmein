import { EditIcon } from "@chakra-ui/icons"
import { Button, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Switch } from "@chakra-ui/react"
import { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { GroupRoutes, ICreateGroup, IGroup, RollType, useCreateGroupMutation, useUpdateGroupMutation } from "../utils/groupApi"
import { useQueryClient } from "react-query"
import { useAuth } from "../providers/AuthProvider";

export const GroupForm = ({ group }: { group?: IGroup }) => {
  const queryClient = useQueryClient()
  const { auth } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const successFunction = async (data: IGroup) => {
    const groupKey = `${GroupRoutes.GROUP}-${data.id}`
    
    queryClient.setQueryData(groupKey, data)
    queryClient.resetQueries(groupKey)
    queryClient.resetQueries(GroupRoutes.GROUP)

    setModalOpen(false)
  }

  const createGroup = useCreateGroupMutation({
    onSuccess: successFunction
  })
  const updateGroup = useUpdateGroupMutation({
    onSuccess: successFunction
  })



  const { register, control, handleSubmit, watch, formState: { errors }, reset } = useForm<ICreateGroup>({
    defaultValues: {
      name: group?.name || "",
      rollType: group?.rollType || RollType.FFA,
      membersCanUpdate: group?.membersCanUpdate || false,
      lockAfterOut: group?.lockAfterOut || false
    }
  });


  const onSubmit: SubmitHandler<ICreateGroup> = async (data) => {
    if (group) {
      await updateGroup.mutateAsync({ ...data, id: group.id })
    }
    if (!group) {
      await createGroup.mutateAsync(data)

    }
    reset()
  }

  return (
    <>
      {group ?
        <IconButton disabled={!auth} onClick={() => setModalOpen(true)} aria-label='Search database' icon={<EditIcon />} />
        :
        <Button disabled={!auth} onClick={() => setModalOpen(true)}>add a group</Button>
      }


      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay />
          <ModalContent w='30'>
            <ModalHeader>{group ? group.name : "New Group"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody alignItems={'center'} alignContent='center'>
              <FormControl mb="4" isInvalid={errors.name ? true : false}>
                <FormLabel htmlFor="name">Group Name</FormLabel>
                <Input {...register('name', { required: "This is required" })} />
                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
              </FormControl>
              <Controller
                name="rollType"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup onChange={onChange} value={value} alignItems='center'>
                    <Stack direction="row">
                      <Radio value="ffa">Free For All</Radio>
                      <Radio value="role">By Role</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              />
              <FormControl display='flex' alignItems='center' mt='2' mb='2'>
                <FormLabel htmlFor='member-change-setting' mb='0'>
                  Members can Make Changes
                </FormLabel>
                <Switch ml={'auto'} {...register('membersCanUpdate')} />
              </FormControl>
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='lock-after-out-setting' mb='0'>
                  Lock After Out
                </FormLabel>
                <Switch ml={'auto'} {...register('lockAfterOut')} />
              </FormControl>

            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr="2" type="submit">Submit</Button>
              <Button colorScheme='red' onClick={() => {
                setModalOpen(false)
                reset()
              }}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}