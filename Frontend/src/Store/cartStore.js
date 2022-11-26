import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const cartStore = (set, get) => ({
  cartItems: [],
  incrementCartItemsQty: (addedProduct, addedQty) => {
    const prodInCart = get().cartItems.some(
      item => item._id === addedProduct._id
    );
    if (prodInCart) {
      set({
        cartItems: get().cartItems.map(item => {
          if (item._id === addedProduct._id) {
            return { ...item, cartQty: item.cartQty + addedQty };
          }
          return item;
        }),
      });
    } else {
      set(state => ({ cartItems: [addedProduct, ...state.cartItems] }));
    }
  },

  decrementCartItemsQty: (_id, subtractQty) => {
    set({
      cartItems: get().cartItems.map(item => {
        if (item._id === _id) {
          return { ...item, cartQty: item.cartQty - subtractQty };
        }
        return item;
      }),
    });
  },

  removeItem: _id => {
    const restItemsInCart = get().cartItems.filter(item => item._id !== _id);
    set({ cartItems: restItemsInCart });
  },

  clearCart: () => {
    set({ cartItems: [] });
  },
});

const useCartStore = create(devtools(persist(cartStore, { name: 'cart', getStorage: () => sessionStorage })));

export default useCartStore;
