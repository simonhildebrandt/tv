import React, { useRef } from 'react';

import { Flex, Icon, IconButton, useDisclosure } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';
import { BsTvFill } from "react-icons/bs";

import { motion } from "framer-motion";

import Search from './search';



const variants = {
  open: { width: '100%' },
  closed: { width: '0' }
};

export default function Header () {
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose
  } = useDisclosure()

  const focusRef = useRef();
  const openSearch = () => {
    onSearchOpen();
    focusRef.current.focus();
    focusRef.current.select();
  }

  return <Flex bg="#2B3240" p={2} direction="row">
    <Flex>
      <IconButton color="#F2DE77" variant="ghost" icon={<Icon as={BsTvFill}/>}/>
    </Flex>
    <Flex flexGrow={1} direction="row" justify="flex-end">
      { !isSearchOpen && <IconButton color="#8596A6" variant="ghost" icon={<SearchIcon />} onClick={openSearch}/> }
      <motion.div
        initial="closed"
        transition={{ duration: 0.3 }}
        animate={isSearchOpen ? 'open' : 'closed'}
        variants={variants}
      >
        <Search onClose={onSearchClose} focusRef={focusRef}/>
      </motion.div>
    </Flex>
  </Flex>
}
