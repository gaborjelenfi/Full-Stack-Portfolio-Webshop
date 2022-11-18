import axios from 'axios';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const allColors = {
  query: `query {allProducts {color}}`,
};

const allManufacturers = {
  query: `query {allProducts {manufacturer}}`,
};

const allPrices = {
  query: `query {allProducts {price}}`,
};

const shopByStore = (set, get) => ({
  errorMessage: null,
  prices: [],
  manufacturers: [],
  colors: [],
  fetchAllColors: async URL => {
    try {
      const response = await axios.post(`${URL}/graphql`, allColors);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ colors: response.data.data.allProducts });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  fetchAllManufacturers: async URL => {
    try {
      const response = await axios.post(`${URL}/graphql`, allManufacturers);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ manufacturers: response.data.data.allProducts });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  fetchAllPrices: async URL => {
    try {
      const response = await axios.post(`${URL}/graphql`, allPrices);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ prices: response.data.data.allProducts });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
});

const useShopByStore = create(
  devtools(persist(shopByStore, { name: 'shopBy' }))
);

export default useShopByStore;
