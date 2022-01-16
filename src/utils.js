import useSWR from 'swr'
import axios from 'axios';

export const appName = "Screenager";

export const cachedImageUrl = url => `//images.weserv.nl/?url=${url}`


const api_host = API_HOST || "http://localhost:5001/screenager/us-central1";

const fetcher = (...args) => axios(...args);
export const apiUrl = path => `${api_host}/api/${path}`;

export const useLocalSWR = path => {
  const result = useSWR(apiUrl(path), fetcher);

  return {
    ...result,
    data: result.data?.data,
    response: result.data
  }
}
