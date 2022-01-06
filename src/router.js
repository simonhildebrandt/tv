import { useEffect } from 'react';
import Navigo from 'navigo';

const router = new Navigo("/");

function useRouter(callable) {
  useEffect(() => callable(router), []);
}

function navigate(path) {
  router.navigate(path);
}

export { useRouter, navigate };
