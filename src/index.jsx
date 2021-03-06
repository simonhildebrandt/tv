import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Provider, ErrorBoundary } from '@rollbar/react';

import App from './app';
import { rollbarConfig } from './utils';



// https://color.adobe.com/Winter-Sunset-color-theme-5403038/

const setup = {
  config: {
  // initialColorMode: "dark",
  // useSystemColorMode: false,
  },
  colors: {
    brand: {
      100: "#2B3240",
      200: "#8596A6",
      300: "#F2DE77",
      400: "#F2BF80",
      500: "#F2994B",
    }
  }
};

const theme = extendTheme(setup);


ReactDOM.render(
  <Provider config={rollbarConfig}>
    <ErrorBoundary>
      <ChakraProvider theme={theme}><App/></ChakraProvider>
    </ErrorBoundary>
  </Provider>,
  document.getElementById('app')
);
