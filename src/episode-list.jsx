import React from 'react';

import { Flex, Button } from '@chakra-ui/react';



function EpisodeListItem({episode, state, onClick}) {
  const { episodeNumber } = episode;

  const { watched } = state || { watched: false };
  const handleClick = () => onClick({watched: !watched});

  return <Button
    onClick={handleClick}
    size="sm"
    width="32px"
    bgColor={ watched ? 'brand.400' : 'gray.300' }
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
    <Flex mt={2} align="center" justify="space-between">
      <Flex fontWeight="bold">Season {season}</Flex>
      <Flex align="center">
        <Button onClick={() => setAllEpisodes({watched: true})} size="sm" variant="ghost">All as watched</Button> /
        <Button onClick={() => setAllEpisodes({watched: false})} size="sm" variant="ghost">None as watched</Button>
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
