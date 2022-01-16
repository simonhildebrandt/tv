import React, { useRef } from 'react';

import { Flex, Icon, IconButton, useDisclosure } from '@chakra-ui/react'
import { SearchIcon, UnlockIcon } from '@chakra-ui/icons';
import { BsTvFill } from "react-icons/bs";

import { motion } from "framer-motion";

import Search from './search';
import { navigate } from './router';

import { logout } from './firebase';


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

  return <Flex bg="brand.100" p={2} direction="row">
    <Flex>
      <IconButton onClick={() => navigate("/")} color="brand.300" variant="ghost" icon={<Icon as={BsTvFill}/>}/>
    </Flex>
    <Flex flexGrow={1} direction="row" justify="flex-end">
      { !isSearchOpen && <IconButton color="brand.200" variant="ghost" icon={<SearchIcon />} onClick={openSearch}/> }
      <motion.div
        initial="closed"
        transition={{ duration: 0.3 }}
        animate={isSearchOpen ? 'open' : 'closed'}
        variants={{open: { width: '100%' }, closed: { width: '0' }}}
      >
        <Search onClose={onSearchClose} focusRef={focusRef}/>
      </motion.div>
      <IconButton onClick={logout} color="brand.200" variant="ghost" icon={<UnlockIcon/>} />
    </Flex>
  </Flex>
}
