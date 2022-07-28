import React from 'react';

import { Flex, Heading, Spinner } from '@chakra-ui/react';

import { appName } from './utils';
import Login from './login';
import ShowList from './show-list';


export default function Main({user}) {

  if (user == null) return <Spinner/>

  if (user) return <ShowList user={user}/>

  return <Flex direction="column" align="stretch">
    <Flex direction="column" align="center" mx={6}>
      <Heading my={6}>Welcome to {appName}.</Heading>
      <Flex mb={6}>...the app that helps you keep track of what show's you're watching, where you're watching them, and when they're available.</Flex>
    </Flex>
    <Login/>
  </Flex>
}
