import { Box, Button, Circle, Flex, FormLabel, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Switch, useColorMode } from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from "@chakra-ui/icons"
import React, { useState } from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [rollType, setRollType] = useState("ffa")
  const { colorMode, toggleColorMode } = useColorMode()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  })


  let body = null
  if (fetching) {

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
        <Button mr={2} onClick={() => logout()} variant="link" isLoading={logoutFetching}>logout</Button>
        <Menu isOpen={optionsOpen}>
          <MenuButton mr={2} onClick={() => { setOptionsOpen(!optionsOpen) }} as={Link} rightIcon={<ChevronDownIcon />}>
            options
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Stack direction="row" spacing={4} align="center">
                <Button onClick={() => setRollType("ffa")} colorScheme="teal" variant={rollType === "ffa" ? "solid" : "outline"}>
                  Free For All
                </Button>
                <Button onClick={() => setRollType("role")} colorScheme="teal" variant={rollType === "role" ? "solid" : "outline"}>
                  By Role
                </Button>
              </Stack>
            </MenuItem>
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