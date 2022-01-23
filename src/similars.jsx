import React from 'react';

import { Flex, Text, Image } from '@chakra-ui/react';


import ImageFallback from './image-fallback';
import { navigate } from './router';


export default function Similars({similars}) {
  return <Flex mb={10} justify="stretch" overflowX="auto">
    { similars.map(item => (
      <Flex
        padding={1}
        key={item.id}
        direction="column"
        width="96px"
        minWidth="96px"
        justify="space-between"
        onClick={() => navigate(`show/${item.id}`)}
      >
        <Image src={item.image} fallback={<ImageFallback />}/>
        <Text fontSize="xs">{ item.fullTitle }</Text>
      </Flex>
    )) }
  </Flex>;
}
