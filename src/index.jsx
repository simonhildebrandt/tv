import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider, extendTheme } from "@chakra-ui/react"

import App from './app';

// https://color.adobe.com/Winter-Sunset-color-theme-5403038/

const config = {
  // initialColorMode: "dark",
  // useSystemColorMode: false,
};

const theme = extendTheme({ config });


ReactDOM.render(<ChakraProvider theme={theme}><App/></ChakraProvider>, document.getElementById('app'));
