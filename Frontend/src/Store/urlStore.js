import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const urlStore = () => ({
  baseURL: 'http://localhost:4000'
});

const useUrlStore = create(devtools(persist(urlStore, { name: 'url' })));

export default useUrlStore;

