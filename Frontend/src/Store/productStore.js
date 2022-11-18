import axios from 'axios';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const emptyProduct = {
  color: '',
  description: '',
  furnitureCategory: '',
  imagePreview: null,
  imgPath: '',
  manufacturer: '',
  name: '',
  onSale: false,
  price: '',
  storageQuantity: '',
};

const productStore = (set, get) => ({
  emptyProduct: emptyProduct,
  errorMessage: null,
  allProducts: [],
  products: [],
  recentlyViewed: [],
  sortBy: 'name',
  asc: true,
  fetchAllProducts: async (allProductsQuery, filterValue, URL) => {
    try {
      const response = await axios.post(`${URL}/graphql`, allProductsQuery);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      const data = response.data.data;
      set({
        products:
          filterValue === 'all' ? data.allProducts : data.allProductsFilter,
      });
      if(filterValue === 'all') {
        set({allProducts: data.allProducts});
      }
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  changeSortBy: sortBy => set({ sortBy }),
  toggleAscDesc: asc => set({ asc }),
  addRecentlyViewed: viewedProduct => {
    const includes = get().recentlyViewed.some(
      item => item.idOfProduct === viewedProduct.idOfProduct
    );
    if (!includes) {
      set(state => ({
        recentlyViewed: [viewedProduct, ...state.recentlyViewed],
      }));
    }
    if (get().recentlyViewed.length >= 4) set(get().recentlyViewed.pop());
  },
  clearRecentlyViewed: () => set({recentlyViewed: []}),
});

const useProductStore = create(
  devtools(persist(productStore, { name: 'products' }))
);

export default useProductStore;
