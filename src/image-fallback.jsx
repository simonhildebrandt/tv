import React from 'react';
import {
  Flex,
  Spinner,
} from '@chakra-ui/react'


export default function ImageFallback() {
  return <Flex bg="gray.200" justify="center" align="center" width="64px" height="64px">
    <Spinner/>
  </Flex>
}
