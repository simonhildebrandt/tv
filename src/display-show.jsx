import React from 'react';

import { Flex, Image, Heading, Button } from '@chakra-ui/react';
import { StarIcon, PlusSquareIcon, CloseIcon } from '@chakra-ui/icons';

import { addRecord, deleteRecord, useFirestoreCollection } from './firebase';
import { cachedImageUrl, useLocalSWR } from './utils';


function AddTools({showId, user, showData}) {
  const { data, loaded } = useFirestoreCollection(`/users/${user.uid}/shows`, ['id', '==', showId])
  console.log({data});

  if (!loaded) return 'loading';

  const recordKey = Object.keys(data)[0];

  const addShow = () => {
    console.log('adding')
    addRecord(`/users/${user.uid}/shows`, {...showData, episodeData: {}})
  }

  const removeShow = () => {
    const path = `/users/${user.uid}/shows/${recordKey}`;
    console.log('removing', path)
    deleteRecord(path)
  }

  if (recordKey) {
    return <Button onClick={removeShow} bg="brand.500" leftIcon={<CloseIcon/>}>Remove From List</Button>
  } else {
    return <Button onClick={addShow} bg="brand.500" leftIcon={<PlusSquareIcon/>}>Add To List</Button>
  }
}


export default function DisplayShow({id, user}) {
  const { data, error } = useLocalSWR(`show/${id}`);

  if (!data) return 'loading'

  const { image, fullTitle, imDbRating, runtimeMins, plot } = data;

  return <Flex p={6}>
    <Flex flexBasis="30%" direction="column">
      <Image src={cachedImageUrl(image)} mb={4}/>
      { user ? (
        <AddTools showId={id} user={user} showData={data}/>
      ) : (
        "loading"
      ) }
    </Flex>
    <Flex flexBasis="70%" ml={6} direction="column">
      <Heading>{fullTitle}</Heading>
      <Flex align="center" mb={2}>
        {runtimeMins}m - {imDbRating} <StarIcon color="yellow.500"/>
      </Flex>
      <Flex>{plot}</Flex>

      <Flex>
        Similars
      </Flex>
    </Flex>
  </Flex>
}
