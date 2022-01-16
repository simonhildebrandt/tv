import React, { useState } from 'react';

import { Flex, Button, Spinner } from '@chakra-ui/react';

import { useLocalSWR } from './utils';
import { updateRecord } from './firebase';
import EpisodeList from './episode-list';


export default function SeasonList({id, imdbId, seasons, episodeData, onEpisodeDataUpdate}) {
  const [season, setSeason] = useState(seasons[0]);

  const { data, error } = useLocalSWR(`show/${imdbId}/season/${season}`, season)

  const episodeUpdate = (update) => {
    onEpisodeDataUpdate({ ...episodeData, ...update })
  };

  console.log('episodes?', data)

  return <Flex direction='column'>
    <Flex justify="flex-start">
      <Flex mr={2} mt={1} color="gray.500">Seasons</Flex>
      <Flex gap={2} wrap="wrap">
        { seasons.map(s => (
          <Button
            key={s}
            bgColor={s == season ? 'brand.500' : 'gray.100'}
            size="sm" width="32px"
            onClick={() => setSeason(s)}
          >{s}</Button>
        )) }
      </Flex>
    </Flex>

    { data ?
      (<EpisodeList
        season={season}
        episodes={data.episodes}
        episodeData={episodeData}
        onEpisodeDataUpdate={episodeUpdate}
      />) : (
        <Spinner/>
      )
    }
  </Flex>
}
