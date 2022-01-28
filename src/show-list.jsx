import React, { useState } from 'react';

import { Flex, Spinner, Button, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { VscCollapseAll } from 'react-icons/vsc';
import { CgReorder } from "react-icons/cg";

import { Reorder } from "framer-motion"

import {
  updateRecord,
  useFirestoreCollection,
  useFirestoreDocument,
  batchUpdate
} from './firebase';
import ShowListItem from './show-list-item';



function EmptyMessage() {
  return <Flex align="center">No items to show - search for shows to add with the <SearchIcon mx={1}/> icon above.</Flex>
}

const watchedFilterOptions = ['all', 'unwatched', 'watched'];

export default function ShowList({user}) {
  const { data, loaded } = useFirestoreCollection(`/users/${user.uid}/shows`)
  const { data: userData, loaded: userLoaded } = useFirestoreDocument(`/users/${user.uid}`)

  const [sorting, setSorting] = useState(false);
  const toggleSorting = () => setSorting(!sorting);

  if (!loaded || !userLoaded) return <Spinner/>

  const { watchedFilterId = 0 } = userData;
  const watchedFilter = watchedFilterOptions[watchedFilterId];

  const cycleWatchedFilter = () => {
    const newWatchedFilterId = (watchedFilterId + 1) % watchedFilterOptions.length;
    updateRecord(`/users/${user.uid}`, { watchedFilterId: newWatchedFilterId});
  };

  const watchedStatus = Object.entries(data).reduce((acc, [key, show]) => {
    if (show.type == 'TVSeries') {
      acc[key] = Object.values(show.episodeData).every(episode => episode.watched);
    } else {
      acc[key] = show.watched;
    }
    return acc;
  }, {});


  let filtered = Object.entries(data).filter(([id, show]) => {
    if (sorting) return true;

    switch (watchedFilter) {
      case 'all':
        return true;
      case 'watched':
        return watchedStatus[id];
      case 'unwatched':
        return !watchedStatus[id];
    }
  });

  filtered = filtered.sort((a, b) => a[1].index - b[1].index);

  const items = filtered.map(i => i[1]);

  const anyOpen = items.some(item => item.isOpen);

  const closeAll = () => {
    Object.keys(data).forEach(key => {
      updateRecord(`/users/${user.uid}/shows/${key}`, {isOpen: false});
    });
  };

  const sortValues = filtered.map(item => item[0])
  const setSortValues = order => batchUpdate(order.map((key, index) => [`/users/${user.uid}/shows/${key}`, {index}]));

  return <Flex
    bg="brand.200"
    flexGrow={1}
    p={4}
    justify="center"
    align="flex-start"
  >
    <Flex
      direction="column"
      justify="stretch"
      maxWidth="600px"
      flexGrow={1}
    >
      <Flex align="center" justify="space-between" mb={2}>
        <IconButton onClick={toggleSorting} colorScheme={sorting ? 'blue' : 'gray'} size="sm" icon={<CgReorder/>}/>
        { !sorting && <Flex justify="flex-end" align="center" gap={2}>
          <Button size="sm" onClick={cycleWatchedFilter}>Showing {watchedFilter}</Button>
          <IconButton onClick={closeAll} disabled={!anyOpen} size="sm" icon={<VscCollapseAll/>}/>
        </Flex>
        }
      </Flex>
      { items.length == 0 ? (
        <EmptyMessage/>
      ) : (
        <>
          { sorting ? (
            <Reorder.Group as="div" axis="y" values={sortValues} onReorder={setSortValues}>
            { filtered.map(([id, item]) => (
              <Reorder.Item as="div" key={id} value={id}>
                <ShowListItem key={id} id={id} item={item} user={user} watched={watchedStatus[id]} sorting={true}/>
              </Reorder.Item>
            )) }
          </Reorder.Group>
        ) : (
            filtered.map(([id, item]) => (
              <ShowListItem key={id} id={id} item={item} user={user} watched={watchedStatus[id]} sorting={false}/>
            ))
          ) }
        </>
      ) }
    </Flex>
  </Flex>
}
