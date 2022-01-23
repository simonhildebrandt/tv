import React from 'react';

import { Flex, Button, IconButton } from '@chakra-ui/react';
import { VscExpandAll, VscCloseAll } from "react-icons/vsc";



function EpisodeListItem({episode, state = { watched: false }, onClick}) {
  const { episodeNumber } = episode;

  const { watched } = state;
  const handleClick = () => onClick({...state, watched: !watched});

  return <Button
    onClick={handleClick}
    size="sm"
    width="32px"
    colorScheme={watched ? 'teal' : 'blue'}
  >{episodeNumber}</Button>
}


export default function EpisodeList({season, episodes, episodeData, onEpisodeDataUpdate}) {
  const setAllEpisodes = data => {
    const newData = episodes.reduce((collect, episode) => {
      return {...collect, [episode.id]: data};
    }, {});
    onEpisodeDataUpdate(newData);
  }

  const onEpisodeUpdate = (id, update) => {
    onEpisodeDataUpdate({[id]: update})
  }

  return <>
    <Flex mt={2} align="center" justify="space-between" mb={2}>
      <Flex fontWeight="bold">Season {season}</Flex>
      <Flex align="center" gap={2}>
        <IconButton icon={<VscExpandAll size="20px"/>} onClick={() => setAllEpisodes({watched: true})} size="sm" />
        <IconButton icon={<VscCloseAll size="20px"/>} onClick={() => setAllEpisodes({watched: false})} size="sm" />
      </Flex>
    </Flex>
    <Flex gap={2} wrap="wrap">
      { episodes.map(episode => (
        <EpisodeListItem
          key={episode.id}
          episode={episode}
          state={episodeData[episode.id]}
          onClick={update => onEpisodeUpdate(episode.id, update)}
        />
      )) }
    </Flex>
  </>
}
