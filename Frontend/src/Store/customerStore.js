import axios from 'axios';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const emptyAddress = {
  firstName: '',
  lastName: '',
  company: '',
  country: '',
  stateOrProvince: '',
  zipCode: '',
  city: '',
  street: '',
  email: '',
  telephone: '',
};

const customerStore = (set, get) => ({
  emptyAddress: emptyAddress,
  errorMessage: null,
  isRouteAccess: false,
  isAuth: false,
  customerId: null,
  token: null,
  customerData: {},
  customerOrders: {},
  isBillingAddressDefault: false,
  isShippingAddressDefault: false,
  billingAddress: emptyAddress,
  shippingAddress: emptyAddress,
  isPasswordCheckboxChecked: false,
  orderData: {},
  orderIsSaved: false,
  signUpCustomer: async (createCustomerMutation, URL) => {
    try {
      const responseSignUp = await axios.post(
        `${URL}/graphql`,
        createCustomerMutation
      );
      if (responseSignUp.data.errors) {
        const [error] = responseSignUp.data.errors;
        throw new Error(error.message);
      }
    } catch (error) {
      throw error;
    }
  },
  login: async (email, password, URL) => {
    const loginCustomerQuery = {
      query: `query LoginCustomer{
        login(
          email:"${email}", 
          password:"${password}")
          {
            token
            customerId
          }
        }`,
    };
    try {
      const response = await axios.post(`${URL}/graphql`, loginCustomerQuery);
      const responseData = response.data.data.login;
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      if (responseData.token && responseData.customerId) {
        set({ isAuth: true });
        set({ customerId: responseData.customerId });
        set({ token: responseData.token });
        get().fetchCustomerData(URL);
      }
    } catch (error) {
      console.log(error);
      set({ errorMessage: error.message });
    }
  },
  logout: () => {
    set({ isAuth: false });
    set({ customerId: null });
    set({ token: null });
    set({ customerData: {} });
    set({ billingAddress: emptyAddress });
    set({ shippingAddress: emptyAddress });
    set({ customerOrders: {} });
  },
  fetchCustomerData: async URL => {
    const customerDataQuery = {
      query: `query FetchCustomerData {
        customer(id: "${get().customerId}") {
          firstName
          lastName
          email
          addresses {
            firstName
            lastName
            country
            stateOrProvince
            zipCode
            street
            telephone
          }
        }
      }`,
    };
    try {
      const response = await axios.post(`${URL}/graphql`, customerDataQuery, {
        headers: {
          Authorization: 'Bearer ' + get().token,
        },
      });
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ customerData: response.data.data.customer });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  fetchCustomerOrders: async (customerOrdersQuery, URL) => {
    try {
      const response = await axios.post(`${URL}/graphql`, customerOrdersQuery, {
        headers: {
          Authorization: 'Bearer ' + get().token,
        },
      });
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      const notDeletedOrders =
        response.data.data.customer.orderedProducts.filter(
          order => order.isDeleted !== true
        );
      set({ customerOrders: notDeletedOrders });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  fetchCustomerAddresses: async (customerId, URL) => {
    const customerAddressQuery = {
      query: `query FetchCustomerAddresses{
        customer(id:"${customerId}"){
          addresses {
            firstName
            lastName
            company
            country
            stateOrProvince
            zipCode
            city
            street
            email
            telephone
            isBillingAddress
            isShippingAddress
          }
        }
      }`,
    };
    try {
      const response = await axios.post(
        `${URL}/graphql`,
        customerAddressQuery,
        {
          headers: {
            Authorization: 'Bearer ' + get().token,
          },
        }
      );
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      const [billingAddress, shippingAddress] =
        response.data.data.customer.addresses;
      set({ billingAddress });
      set({ shippingAddress });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  updateCustomerAddresses: async (updateCustomerAddressesQuery, URL) => {
    try {
      const response = await axios.post(
        `${URL}/graphql`,
        updateCustomerAddressesQuery,
        {
          headers: {
            Authorization: 'Bearer ' + get().token,
          },
        }
      );
      const data = response.data.data.updateCustomerAddress;
      if (data.isBillingAddress) set({ billingAddress: data });
      if (data.isShippingAddress) set({ shippingAddress: data });
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error);
      set({ errorMessage: error.message });
    }
  },
  editAccount: async (updateCustomerQuery, URL) => {
    try {
      const response = await axios.post(`${URL}/graphql`, updateCustomerQuery, {
        headers: {
          Authorization: 'Bearer ' + get().token,
        },
      });
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  createOrder: async (createOrderQuery, isAuth, URL) => {
    try {
      const response = await axios.post(`${URL}/graphql`, createOrderQuery);
      if (response.data.errors) {
        const [error] = response.data.errors;
        console.log(error.message);
        throw new Error(error.message);
      }
      const orderResponse = response.data.data.createOrder;
      const customerId = get().customerId;
      const updateCustomerOrders = {
        query: `mutation UpdateCustomerOrders($order: [OrderInput]!) {
          updateCustomerOrders(
            customerId: "${customerId}",
            order: $order) {
              customerId
            }
          }`,
        variables: {
          order: orderResponse,
        },
      };
      if (isAuth) {
        await axios.post(`${URL}/graphql`, updateCustomerOrders, {
          headers: {
            Authorization: 'Bearer ' + get().token,
          },
        });
      }
      set({ errorMessage: null });
      set({ orderIsSaved: true });
      await axios.post(`${URL}/send-mail`, {
        orderData: orderResponse,
        email: get().orderData.orderBillingAddress.email,
      });
    } catch (error) {
      console.log(error);
      set({ orderIsSaved: false });
      set({ errorMessage: error.message });
    }
  },
  clearCustomerData: () => set({ customerData: {} }),
  setOrderData: data =>
    set({ orderData: { ...get().orderData, [`${data.key}`]: data.value } }),
  clearOrderData: () => set({ orderData: {} }),
  setIsBillingAddressDefault: isBillingAddressDefault =>
    set({ isBillingAddressDefault }),
  setIsShippingAddressDefault: isShippingAddressDefault =>
    set({ isShippingAddressDefault }),
  setErrorMessage: message => set({ errorMessage: message }),
  setRouteAccess: isRouteAccess => set({ isRouteAccess }),
  setPasswordCheckbox: isPasswordCheckboxChecked =>
    set({ isPasswordCheckboxChecked }),
});

const useCustomerStore = create(
  devtools(persist(customerStore, { name: 'customerStore' }))
);

export default useCustomerStore;
