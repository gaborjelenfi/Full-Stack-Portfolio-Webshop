import axios from 'axios';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const adminStore = (set, get) => ({
  accessErrMsg: 'Access Denied',
  accessDenied: null,
  errorMessage: null,
  isAdminAuth: false,
  adminId: null,
  token: null,
  loggedInAdminData: {},
  allAdmins: [],
  isPasswordCheckboxChecked: false,
  graphqlQuery: async (graphqlQuery, URL) => {
    try {
      const response = await axios.post(`${URL}/graphql`, graphqlQuery, {
        headers: {
          Authorization: 'Bearer ' + get().token,
        },
      });
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
    } catch (error) {
      if (error.message !== 'Access Denied') {
        console.error(error);
        set({ errorMessage: error.message });
      }
      set({ accessDenied: true });
    }
  },
  login: async (email, password, URL) => {
    const loginAdminQuery = {
      query: `query AdminLogin{
        adminLogin(
            email: "${email}",
            password: "${password}") {
          token
          adminId
        }
      }`,
    };
    try {
      const response = await axios.post(`${URL}/graphql`, loginAdminQuery);
      const responseData = response.data.data.adminLogin;
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      if (responseData.token && responseData.adminId) {
        set({ isAdminAuth: true });
        set({ adminId: responseData.adminId });
        set({ token: responseData.token });
        get().fetchAdminData(URL);
      }
    } catch (error) {
      console.log(error);
      set({ errorMessage: error.message });
    }
  },
  logout: () => {
    set({ isAdminAuth: false });
    set({ adminId: null });
    set({ token: null });
    set({ loggedInAdminData: {} });
  },
  fetchAdminData: async URL => {
    const adminDataQuery = {
      query: `query FetchAdminData{
        admin(id: "${get().adminId}") {
          firstName
          lastName
          email
          mainAdmin
        }
      }`,
    };
    try {
      const response = await axios.post(`${URL}/graphql`, adminDataQuery, {
        headers: {
          Authorization: 'Bearer ' + get().token,
        },
      });
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ loggedInAdminData: response.data.data.admin });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  fetchAllAdmins: async URL => {
    const allAdminsQuery = {
      query: `query FetchAllAdmins{
        allAdmins {
          _id
          firstName
          lastName
          email
          mainAdmin
          isDeleted
        }
      }`,
    };
    try {
      const response = await axios.post(`${URL}/graphql`, allAdminsQuery, {
        headers: {
          Authorization: 'Bearer ' + get().token,
        },
      });
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      set({ allAdmins: response.data.data.allAdmins });
    } catch (error) {
      set({ errorMessage: error.message });
    }
  },
  setPasswordCheckbox: isPasswordCheckboxChecked =>
    set({ isPasswordCheckboxChecked }),
  setErrorMessage: message => set({ errorMessage: message }),
  setAccessDenied: boolean => set({ accessDenied: boolean }),
});

const useAdminStore = create(devtools(persist(adminStore, { name: 'admin' })));

export default useAdminStore;
