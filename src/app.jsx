import React, { useRef, useReducer } from 'react';
import { Box, Flex } from '@chakra-ui/react'

import { useRouter } from './router';
import Header from './header';

import DisplayShow from './display-show';
import Main from './main';

import { handleSigninLink, logout, withUser } from './firebase';


const routeDefaults = { page: null }

function getPageForRoute(state, user) {
  const { page, id } = state;

  switch(page) {
    case 'main':
      return <Main user={user} />
    case 'show':
      return <DisplayShow id={id} user={user}/>;
    default:
      "loading"
  }
}

export default function App() {
  const [routerState, setRouterState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    routeDefaults
  )
  const user = withUser();


  useRouter(router => {
    router.on("/login", () => {
      console.log("logging in!")
      handleSigninLink()
    })
    .on("/", () => {
      setRouterState({page: "main"})
    })
    .on("/show/:id", ({data: {id}}) => {
      setRouterState({page: "show", id})
    })
    .resolve()
  })

  const page = getPageForRoute(routerState, user)
  console.log({page})

  return <Flex direction="column" height="100%">
    <Header/>
    <Flex direction="column" overflowY="hidden" flex="1 1 auto">
      <Flex direction="column" overflowY="auto" flexGrow={1}>{ page }</Flex>
    </Flex>
  </Flex>
}
