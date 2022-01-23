import React, { useEffect, useState } from 'react';

import { Flex, Image, Heading, Button, Spinner } from '@chakra-ui/react';
import { StarIcon, PlusSquareIcon, CloseIcon } from '@chakra-ui/icons';

import axios from 'axios';

import { addRecord, deleteRecord, useFirestoreCollection } from './firebase';
import { cachedImageUrl, apiUrl } from './utils';
import Similars from './similars';
import SeasonsShow from './seasons-show';


function AddTools({showId, user, showData, seasonData}) {
  const { data, loaded } = useFirestoreCollection(`/users/${user.uid}/shows`);

  if (!loaded) return <Spinner/>;

  const result = Object.entries(data).find(([key, show]) => {
    return show.id == showId;
  });

  const episodeData = {};
  const watched = false;

  seasonData.forEach(([_key, season]) =>
    season.episodes.forEach(({id}) => episodeData[id] = {watched})
  );

  const addShow = () => {
    const indices = Object.values(data).map(show => show.index);
    const index = Math.max(...indices) + 1;
    addRecord(`/users/${user.uid}/shows`, {...showData, index, episodeData})
  }

  const removeShow = () => {
    const [recordKey, showInList] = result;

    const path = `/users/${user.uid}/shows/${recordKey}`;
    deleteRecord(path);
  }


  if (result) {
    return <Button onClick={removeShow} bg="brand.500" leftIcon={<CloseIcon/>}>Remove From List</Button>
  } else {
    return <Button onClick={addShow} bg="brand.500" leftIcon={<PlusSquareIcon/>}>Add To List</Button>
  }
}


export default function DisplayShow({id, user}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(apiUrl(`show/${id}`))
      .then(result => setData(result.data));
  }, [id]);


  const {
    image,
    fullTitle,
    imDbRating,
    runtimeMins,
    plot,
    similars,
    tvSeriesInfo,
    type
  } = data || {};

  const seasons = tvSeriesInfo?.seasons;

  const [seasonData, setSeasonData] = useState(null);

  useEffect(() => {
    if (type) {
      if (type == 'TVSeries') {
        console.log('get seasons!', [id, seasons])
        if (seasons) {
          Promise.all(
            seasons.map(season => {
              return axios
                .get(apiUrl(`show/${id}/season/${season}`))
                .then(result => [season, result.data])
            })
          ).then(list => {
            console.log({list})
            setSeasonData(list)
          })
        }
      } else {
        setSeasonData([]);
      }
    }
  }, [id, seasons, type]);


  if (!data) return <Spinner/>

  return <Flex direction="column" overflow="hidden" flexGrow={1} justify="stretch">
    <Flex overflow="auto" p={6} flexGrow={1} direction={["column", "row"]}>
      <Flex flexBasis="30%" direction="column">
        { (user && seasonData) ? (
          <AddTools showId={id} user={user} showData={data} seasonData={seasonData}/>
        ) : (
          <Spinner/>
        ) }
        <Image src={cachedImageUrl(image)} mt={4}/>
      </Flex>
      <Flex flexBasis="70%" ml={[0, 6]} mt={[4, 0]} direction="column">
        <Heading size="lg">{fullTitle}</Heading>
        <Flex align="center" mb={2}>
          {runtimeMins && `${runtimeMins}m - `} {imDbRating} <StarIcon color="yellow.500"/>
        </Flex>
        <Flex fontSize="sm" mb={6}>{plot}</Flex>
        { (type == 'TVSeries' && seasonData) && <SeasonsShow id={id} seasons={seasonData}/> }
      </Flex>
    </Flex>
    <Flex pt={4}>
      <Similars similars={similars}/>
    </Flex>
  </Flex>
}
