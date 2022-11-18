import axios from 'axios';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const allCategory = {
  query: `query FetchCategory{allCategory {
    _id
    name
    categoryId}}`,
};

const allManufacturers = {
  query: `query AllManufacturersData{
    allManufacturers {
      _id
      name
    }
  }`,
};

const filterStore = (set, get) => ({
  errorMessage: null,
  filterValue: 'all',
  filterName: 'categoryName',
  categories: [],
  allManufacturersData: [],
  fetchAllCategories: async URL => {
    try {
      const response = await axios.post(`${URL}/graphql`, allCategory);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ categories: response.data.data.allCategory });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  changeFilter: (filterName, filterValue) => set({ filterName, filterValue }),
  fetchManufacturersData: async URL => {
    try {
      const response = await axios.post(`${URL}/graphql`, allManufacturers);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ allManufacturersData: response.data.data.allManufacturers });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
});

const useFilterStore = create(
  devtools(persist(filterStore, { name: 'category' }))
);

export default useFilterStore;
