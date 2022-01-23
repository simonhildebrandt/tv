import axios from 'axios';

export const appName = "Screenager";

export const cachedImageUrl = url => `//images.weserv.nl/?url=${url}`

const api_host = API_HOST || "http://localhost:5001/screenager/us-central1";

export const apiUrl = path => `${api_host}/api/${path}`;

export const rollbarConfig = {
  accessToken: '2eb328c7201341fe95cdf06b29a138e6',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: API_HOST ? 'production' : 'development',
  },
}
