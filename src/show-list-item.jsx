import React, { useState } from 'react';

import {
  IconButton,
  Flex,
  Image,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import {
  StarIcon,
  CheckIcon,
  DeleteIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@chakra-ui/icons';

import ImageFallback from './image-fallback';
import { cachedImageUrl } from './utils';

import { updateRecord, deleteRecord } from './firebase';

import SeasonList from './season-list';


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


export default function ShowListItem({id, item, user}) {
  const { id: imdbId, title, image, year, runtimeMins, imDbRating, type, watched, episodeData, tvSeriesInfo } = item;
  const typeLabel = type == 'TVSeries' ? 'TV series' : 'movie';

  const { isOpen, onToggle } = useDisclosure();

  const selfPath = `users/${user.uid}/shows/${id}`

  function toggleWatched() {
    updateRecord(selfPath, {watched: !watched});
  }

  function onDelete() {
    deleteRecord(selfPath)
  }

  function updateEpisodeData(episodeData) {
    updateRecord(selfPath, {episodeData});
  }

  return <Flex
    p={2}
    borderBottomWidth={1}
    cursor="pointer"
    direction="column"
    justify="stretch"
  >
    <Flex>
      <Image boxSize="64px" fit="contain" src={cachedImageUrl(image)} fallback={<ImageFallback/>}/>
      <Flex ml={2} direction="column" flexGrow={1}>
        <Flex fontSize={20} fontWeight="bold">{title}</Flex>
        <Flex align="center">{year} {typeLabel} - {runtimeMins}m - {imDbRating} <StarIcon color="yellow.500"/></Flex>
      </Flex>
      <Flex>
        <IconButton variant="ghost" onClick={onToggle} icon={<ChevronDownIcon/>} />
      </Flex>
    </Flex>

    { isOpen && (
      <Flex mt={2} direction="column">
        { type == 'TVSeries' &&
          <SeasonList
            id={id}
            imdbId={imdbId}
            seasons={tvSeriesInfo.seasons}
            episodeData={episodeData}
            onEpisodeDataUpdate={updateEpisodeData}
          />
        }

        <Flex mt={4} justify="space-between">
          { watched && <Button onClick={toggleWatched} colorScheme="yellow" mr={2} leftIcon={<CloseIcon/>}>Mark not watched</Button> }
          { !watched && <Button onClick={toggleWatched} colorScheme="green" mr={2} leftIcon={<CheckIcon/>}>Mark watched</Button> }
          <DeleteWidget onDelete={onDelete} text="Remove" />
        </Flex>
      </Flex>
    )}
  </Flex>;
}
