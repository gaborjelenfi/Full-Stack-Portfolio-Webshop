import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const paginateStore = (set, get) => ({
  pageCount: 0,
  itemOffset: 0,
  itemsPerPage: 10,

  setPageCount: num => set({ pageCount: num }),
  setItemOffset: num => set({ itemOffset: num }),
  setItemsPerPage: num => set({ itemsPerPage: num }),
});

const usePaginateStore = create(
  devtools(persist(paginateStore, { name: 'paginate' }))
);

export default usePaginateStore;
