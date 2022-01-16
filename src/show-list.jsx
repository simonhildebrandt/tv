import React from 'react';

import { Flex, Spinner } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import { useFirestoreCollection } from './firebase';

import ShowListItem from './show-list-item';



function EmptyMessage() {
  return <Flex align="center">Search for shows to add with the <SearchIcon mx={1}/> icon above.</Flex>
}


export default function ShowList({user}) {
  const { data, loaded } = useFirestoreCollection(`/users/${user.uid}/shows`)

  if (!loaded) return <Spinner/>

  if (Object.keys(data).length == 0) return <EmptyMessage/>

  return <Flex
    direction="column"
    bg="brand.200"
    flexGrow={1}
    p={4}
  >
    <Flex bg="white" direction="column" maxWidth="600px" mx="auto">
      { Object.entries(data).map(([id, item]) => (
        <ShowListItem key={id} id={id} item={item} user={user}/>
      )) }
    </Flex>
  </Flex>
}
