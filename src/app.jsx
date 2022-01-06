import React, { useRef, useReducer } from 'react';
import { Flex } from '@chakra-ui/react'

import { useRouter } from './router';
import Header from './header';


const routeDefaults = { page: null }

function getPageForRoute(state) {
  const { page, id } = state;

  switch(page) {
    case 'main':
      return 'main!'
    case 'show':
      return 'show - ' + id;
  }
}

export default function App() {
  const [routerState, setRouterState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    routeDefaults
  )

  useRouter(router => {
    router.on("/", () => {
      setRouterState({page: "main"})
    })
    .on("/show/:id", ({data: {id}}) => {
      setRouterState({page: "show", id})
    })
    .resolve()
  })

  const page = getPageForRoute(routerState)

  return <Flex display="column" height="100%">
    <Header/>
  </Flex>
}
