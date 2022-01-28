import React, { useState } from 'react';

import {
  IconButton,
  Flex,
  Image,
  Button,
  useDisclosure,
  Heading
} from '@chakra-ui/react';
import {
  StarIcon,
  CheckIcon,
  DeleteIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@chakra-ui/icons';

import { motion } from "framer-motion";

import ImageFallback from './image-fallback';
import { cachedImageUrl } from './utils';

import { updateRecord, deleteRecord } from './firebase';

import SeasonList from './season-list';
import { navigate } from './router';


function DeleteWidget({onDelete}) {
  const { isOpen, onToggle } = useDisclosure();

  if (isOpen) {
    return <Flex align="center" fontWeight="bold">
      <Button onClick={onDelete} colorScheme="red" leftIcon={<DeleteIcon/>}>Sure?</Button>
      <IconButton onClick={onToggle} colorScheme="gray" ml={2} icon={<CloseIcon/>}/>
    </Flex>
  } else {
    return <Button onClick={onToggle} colorScheme="red" mr={2} leftIcon={<DeleteIcon/>}>Remove</Button>
  }
}


export default function ShowListItem({id, item, user, watched, sorting}) {
  const {
    id: imdbId,
    title,
    image,
    year,
    runtimeMins,
    imDbRating,
    type,
    episodeData,
    tvSeriesInfo,
    isOpen,
    currentSeason,
    index
  } = item;

  const typeLabel = type == 'TVSeries' ? 'TV series' : 'movie';

  const onToggle = () => updateData({isOpen: !isOpen});

  const selfPath = `users/${user.uid}/shows/${id}`

  function setWatched(watched) {
    if (type == 'TVSeries') {
      const newEpisodeData = Object.entries(episodeData).reduce((acc, [id, episode]) => {
        acc[id] = {...episode, watched}
        return acc;
      }, {});
      updateRecord(selfPath, {episodeData: newEpisodeData});
    } else {
      updateRecord(selfPath, {watched});
    }
  }

  function onDelete() {
    deleteRecord(selfPath)
  }

  function updateData(data) {
    updateRecord(selfPath, data);
  }

  const showOpen = isOpen && !sorting;

  return <Flex
    p={2}
    borderBottomWidth={1}
    direction="column"
    justify="stretch"
    bgColor="white"
    overflow="hidden"
  >
    <Flex>
      <Image boxSize="64px" fit="contain" src={cachedImageUrl(image)} fallback={<ImageFallback/>}/>
      <Flex ml={2} direction="column" flexGrow={1}>
        <Flex align="center">
          <Heading
            cursor="pointer"
            onClick={() => navigate(`show/${imdbId}`)}
            color={watched ? 'gray' : 'black'}
            fontSize={20}
            fontWeight="bold"
          >
            {title}
            { watched && <CheckIcon ml={2}/> }
          </Heading>
        </Flex>
        <Flex align="center">{year} {typeLabel} - {runtimeMins}m - {imDbRating} <StarIcon color="yellow.500"/></Flex>
      </Flex>
      <Flex>
        { !sorting && <IconButton variant="ghost" onClick={onToggle} icon={showOpen ? <ChevronUpIcon/> : <ChevronDownIcon/>} /> }
      </Flex>
    </Flex>

    <motion.div
      initial={showOpen ? "open" : "closed"}
      transition={{ duration: 0.2 }}
      animate={showOpen ? 'open' : 'closed'}
      variants={{open: { height: 'auto' }, closed: { height: '0' }}}
    >
      <Flex mt={2} direction="column">
        { type == 'TVSeries' &&
          <SeasonList
            id={id}
            imdbId={imdbId}
            seasons={tvSeriesInfo.seasons}
            episodeData={episodeData}
            currentSeason={currentSeason}
            onUpdate={updateData}
          />
        }

        <Flex mt={4} justify="space-between">
          <Button
            mr={2}
            onClick={() =>setWatched(!watched)}
            colorScheme={watched ? 'yellow' : 'green'}
            leftIcon={watched ? <CloseIcon/> : <CheckIcon/>}
          >
            Mark { watched && 'not '} watched
          </Button>
          <DeleteWidget onDelete={onDelete} text="Remove" />
        </Flex>
      </Flex>
    </motion.div>
  </Flex>;
}
