import React, { useState } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';



export default function SeasonsShow({seasons}) {
  console.log({seasons})
  const [currentSeason, setCurrentSeason] = useState(seasons[0][0]);
  const episodes = seasons.find(season => season[0] == currentSeason)[1].episodes;

  console.log({episodes})

  return <Flex display="column" width="100%" flexShrink={1}>
    <Flex align="center" mb={6}>
      Seasons
      <Flex gap={2} ml={2} wrap="wrap">
        { seasons.map(([key, season]) => (
          <Button
            bgColor={key == currentSeason ? 'brand.500' : 'gray.100'}
            key={key}
            onClick={() => setCurrentSeason(key)}
          >{key}</Button>
        )) }
      </Flex>
    </Flex>
    <Flex direction="column" gap={2} width="100%" overflowY="auto" flexShrink={1}>
      { episodes.map(({episodeNumber, id, title, plot}) => (
        <Flex key={id} width="100%">
          <Flex width={8} flex="0 0 auto">{episodeNumber}.</Flex>
          <Flex direction="column" flex="1 1 auto">
            <Flex fontWeight="bold">{title}</Flex>
            <Flex direction="column" fontSize="sm" flexShrink={1}>{plot}</Flex>
          </Flex>
        </Flex>
      )) }
    </Flex>
  </Flex>
}
