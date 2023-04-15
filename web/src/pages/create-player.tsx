import { HStack, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useQueryClient } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Layout } from '../components/Layout';

interface ICreatePlayer {
  name: string,
  tank: boolean,
  healer: boolean,
  dps: boolean,
  inTheRoll: boolean,
  locked: boolean
}

const CreatePlayer: React.FC<{}> = ({ }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ICreatePlayer>({
    defaultValues: { name: "", tank: false, healer: false, dps: false, inTheRoll: false, locked: false }
  });
  const queryClient = useQueryClient()
  const router = useRouter()

  const onSubmit: SubmitHandler<ICreatePlayer> = (data) => {
    console.log('create player submit')
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack>
          <Input {...register('name')} />
        </HStack>
      </form>
    </>
  )
};

export default CreatePlayer;