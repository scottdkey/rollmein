import { Box, Button, HStack, Input } from '@chakra-ui/react';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { Layout as Layout } from '../components/Layout';
import { useQueryClient } from 'react-query';
import { useAuth } from '../providers/AuthProvider';
import { SubmitHandler, useForm } from 'react-hook-form';

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
  const { auth } = useAuth()
  const router = useRouter()

  const onSubmit: SubmitHandler<ICreatePlayer> = (data) => {
    console.log('create player submit')
  }
  return (
    <Layout variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack>
          <Input {...register('name')} />
        </HStack>
      </form>
    </Layout >
  )
};

export default CreatePlayer;