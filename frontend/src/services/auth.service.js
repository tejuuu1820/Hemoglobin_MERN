import API_ENDPOINTS from '../constants/apiEndpoints';
import { clearToken, saveToken } from '../helpers/auth-token';
import { deleteAllLocalData, saveUserDetails } from '../helpers/localstorage';
import api from './api.service';
const { jwtDecode } = require('jwt-decode');

const signUp = async (payload) => {
  try {
    const res = await api.post(API_ENDPOINTS.SIGNUP_API, payload);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const login = async (payload) => {
  try {
    const res = await api.post(API_ENDPOINTS.LOGIN_API, payload);
    setLoginToken(res.data.data);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const setLoginToken = (data) => {
  console.log(data);
  saveToken(data);
  const decoded = jwtDecode(data);
  saveUserDetails(decoded);
};

const logout = () => {
  clearToken();
  deleteAllLocalData();
};

const forgotPassword = async (payload) => {
  try {
    const res = await api.post(API_ENDPOINTS.APP_FORGOT_PASSWORD_API, payload);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const resetPassword = async (payload) => {
  try {
    const res = await api.post(API_ENDPOINTS.APP_RESET_PASSWORD_API, payload);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const authServices = {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
};

export default authServices;
