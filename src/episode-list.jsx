import React, { useState } from 'react';

import { Flex, Button, IconButton } from '@chakra-ui/react';
import { VscExpandAll, VscCloseAll } from "react-icons/vsc";

import { CgDetailsMore } from 'react-icons/cg';

import EpisodeDetails from './episode-details';



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


export default function EpisodeList({imdbId, season, episodes, episodeData, onEpisodeDataUpdate}) {
  const setAllEpisodes = data => {
    const newData = episodes.reduce((collect, episode) => {
      return {...collect, [episode.id]: data};
    }, {});
    onEpisodeDataUpdate(newData);
  }

  const onEpisodeUpdate = (id, update) => {
    onEpisodeDataUpdate({[id]: update})
  }

  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails(!showDetails);

  return <>
    <Flex mt={2} align="center" justify="space-between" mb={2}>
      <Flex align="center" gap={2}>
        <Flex fontWeight="bold">Season {season}</Flex>
        <IconButton colorScheme={showDetails ? 'blue' : 'gray'} onClick={toggleDetails} size="sm" icon={<CgDetailsMore size="20px"/>}/>
      </Flex>
      <Flex align="center" gap={2}>
        <IconButton icon={<VscExpandAll size="20px"/>} onClick={() => setAllEpisodes({watched: true})} size="sm" />
        <IconButton icon={<VscCloseAll size="20px"/>} onClick={() => setAllEpisodes({watched: false})} size="sm" />
      </Flex>
    </Flex>
    { showDetails ? (
      <Flex maxHeight="60vh" direction="column" overflow="hidden">
        <EpisodeDetails
          imdbId={imdbId}
          season={season}
          onUpdate={(id, update) => onEpisodeUpdate(id, update)}
          episodeData={episodeData}
        />
      </Flex>
    ) : (
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
    ) }
  </>
}
