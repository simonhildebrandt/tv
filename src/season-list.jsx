import React, { useEffect, useState } from 'react';

import { Flex, Button, Spinner } from '@chakra-ui/react';

import axios from 'axios';

import { apiUrl } from './utils';
import { updateRecord } from './firebase';
import EpisodeList from './episode-list';


export default function SeasonList({id, imdbId, seasons, episodeData, currentSeason, onUpdate}) {
  const season = currentSeason || seasons[0];
  const updateSeason = s => onUpdate({currentSeason: s});

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(apiUrl(`show/${imdbId}/season/${season}`))
      .then(result => {
        setData(result.data);
        setLoading(false);
      })
  }, [season]);

  const episodeUpdate = (update) => {
    onUpdate({episodeData: { ...episodeData, ...update }})
  };

  return <Flex direction='column'>
    <Flex justify="flex-start">
      <Flex mr={2} mt={1} color="gray.500">Seasons</Flex>
      <Flex gap={2} wrap="wrap">
        { seasons.map(s => (
          <Button
            key={s}
            bgColor={s == season ? 'brand.500' : 'gray.100'}
            size="sm" width="32px"
            onClick={() => updateSeason(s)}
          >{s}</Button>
        )) }
      </Flex>
    </Flex>

    { data ?
      (<Flex opacity={loading ? '0.7' : '1'} direction="column">
          <EpisodeList
            imdbId={imdbId}
            season={season}
            episodes={data.episodes}
            episodeData={episodeData}
            onEpisodeDataUpdate={episodeUpdate}
          />
        </Flex>
      ) : (
        <Spinner/>
      )
    }
  </Flex>
}
