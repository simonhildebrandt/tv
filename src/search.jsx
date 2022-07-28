import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  CloseButton,
  Input,
  Flex,
  Image,
  SimpleGrid,
  InputRightElement,
  InputGroup,
  Skeleton,
  useOutsideClick
} from '@chakra-ui/react'
import { debounce } from 'throttle-debounce';

import axios from 'axios';

import useEscapeListener from './use-escape-listener';
import { navigate } from './router';
import { cachedImageUrl, apiUrl } from './utils';

import ImageFallback from './image-fallback';


function SearchResults({results, state, onSelect}) {
  let resultList = [];

  if (state == 'searching') {
    const count = results?.length || 3;
    resultList = [...Array(count).keys()].map(i => (
      <Skeleton key={i} height='64px' />
    ))
  } else {
    resultList = results.map(result => (
      <Flex
        key={result.id}
        onClick={() => onSelect(result.id)}
        cursor="pointer"
        _hover={{ bg: 'gray.200' }}
        bg="white"
      >
        <Image boxSize="64px" fit="contain" src={cachedImageUrl(result.image)} fallback={<ImageFallback/>}/>
        <Flex direction="column" ml={4}>
        <Flex fontSize={16} fontWeight="bold">{result.title}</Flex>
        <Flex>{result.description}</Flex>
        </Flex>
      </Flex>
    ))
  }

  return <SimpleGrid columns={1} spacing={2} width="100%">
    { resultList }
  </SimpleGrid>
}


export default function Search({onClose, focusRef}) {
  const [searchValue, setSearchValue] = useState("");
  const [searchState, setSearchState] = useState('new');
  const [searchResults, setSearchResults] = useState([]);
  const [showingResult, setShowingResults] = useState(false);

  const openResults = () => setShowingResults(true);

  const hideSearch = useCallback(() => {
    setShowingResults(false);
    setSearchState('new');
    onClose();
  });

  const requestCancel = useRef();

  const debouncedSearch = useMemo(() => debounce(300, searchValue => {
    setSearchState('searching');
    requestCancel.current?.cancel();
    requestCancel.current = axios.CancelToken.source();

    axios.post(
      apiUrl("search"),
      { searchValue },
      { cancelToken: requestCancel.current.token }
    )
    .then(res => {
      setSearchState('done');
      setSearchResults(res.data.results);
      requestCancel.current = null;
    })
    .catch(thrown => {
      if (!axios.isCancel(thrown)) throw(thrown);
    })
  }), []);

  const ref = React.useRef()
  useOutsideClick({
    ref: ref,
    handler: () => hideSearch(),
  })

  const updateSearchValue = e => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEscapeListener(hideSearch);

  const onSelect = id => {
    hideSearch();
    navigate(`show/${id}`);
  }

  return <Flex
    direction="column"
    ref={ref}
    position="relative"
  >
    <InputGroup overflow="hidden">
      <Input
        bg="white"
        value={searchValue}
        onChange={updateSearchValue}
        onFocus={openResults}
        ref={focusRef}
      />
      <InputRightElement children={<CloseButton color='brand.100' onClick={hideSearch} /> } />
    </InputGroup>
    {showingResult &&
      <Flex
        mt={1}
        borderWidth={1}
        borderRadius={8}
        position="absolute"
        right="0px"
        top="40px"
        width="100%"
        bg="white"
        overflow="hidden"
        zIndex={1}
      >
        { searchState == 'new' ? (
          <Flex p={2} fontStyle="italic">Try searching for a movie or tv show name</Flex>
        ) : (
          <SearchResults onSelect={onSelect} results={searchResults} state={searchState} />
        ) }

      </Flex>
    }
  </Flex>
}
