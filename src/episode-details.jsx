import React, { useState, useEffect } from 'react';
import { Flex, Button, Spinner } from '@chakra-ui/react';

import axios from 'axios';

import { apiUrl } from './utils';


export default function EpisodeDetails({imdbId, season, episodeData, onUpdate}) {
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

  if (!data) return <Spinner/>

  const handleClick = (id) => {
    const { watched, ...rest} = episodeData[id];
    onUpdate(id, {...rest, watched: !watched});
  }

  const watched = id => episodeData[id].watched;

  const { episodes } = data;

  return <Flex direction="column" gap={2} width="100%" overflowY="auto" flexShrink={1}p={1}>
    { episodes.map(({episodeNumber, id, title, plot}) => (
      <Flex key={id} width="100%" gap={2}>
        <Flex width={8} flex="0 0 auto">
          <Button
            onClick={() => handleClick(id)}
            size="sm"
            width="32px"
            colorScheme={watched(id) ? 'teal' : 'blue'}
          >{episodeNumber}</Button>
        </Flex>
        <Flex direction="column" flex="1 1 auto">
          <Flex fontWeight="bold">{title}</Flex>
          <Flex direction="column" fontSize="sm" flexShrink={1}>{plot}</Flex>
        </Flex>
      </Flex>
    )) }
  </Flex>
}
