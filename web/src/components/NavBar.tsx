import { Box, Button, Circle, Flex, FormLabel, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Switch, useColorMode } from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from "@chakra-ui/icons"
import React, { useState, useEffect } from 'react'
import NextLink from "next/link"
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/constants';
import { useApolloClient } from '@apollo/client';
import router from 'next/router';
import { deleteCookie } from '../utils/cookieHelpers';
interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
  // const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const { cache } = useApolloClient()
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [rollType, setRollType] = useState("ffa")
  const [logoutLoading, setLogoutLoading] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()
  const { data, loading, refetch } = useMeQuery({
    skip: isServer(),
  });


  useEffect(() => {
    refetch()
  }, [])

  const OptionsMenu = () => {
    return (
      <Menu isOpen={optionsOpen}>
        <MenuButton mr={2} onClick={() => { setOptionsOpen(!optionsOpen) }} >
          options
        </MenuButton>
        <MenuList>

          <Stack direction="row" spacing={4} align="center">
            <Button onClick={() => setRollType("ffa")} colorScheme="teal" variant={rollType === "ffa" ? "solid" : "outline"}>
              Free For All
            </Button>
            <Button onClick={() => setRollType("role")} colorScheme="teal" variant={rollType === "role" ? "solid" : "outline"}>
              By Role
            </Button>
          </Stack>
          <MenuItem>
            <FormLabel htmlFor="lock" mb="0">
              Lock after Out?
            </FormLabel>
            <Switch colorScheme="teal" id="lock" />
          </MenuItem>
          <MenuItem onClick={() => toggleColorMode()}>
            <Flex alignItems="center">
              <Circle size="40px" bg="tomato" color="white">
                {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
              </Circle>
            </Flex>

          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

  let body = null
  if (loading) {
    <>
      Loading
    </>
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link >register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2} alignContent="center">{data.me.username}</Box>
        <Button mr={2} onClick={async () => {
          await cache.reset()
          deleteCookie()
          setLogoutLoading(true)

          router.push("/login")

        }} variant="link" isLoading={logoutLoading}>logout</Button>
        <OptionsMenu />
      </Flex>
    )

  }
  return (
    <Flex position="sticky" zIndex={2} bg="tan" p={4} >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>);
}



export default NavBar
