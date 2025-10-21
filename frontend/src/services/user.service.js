import API_ENDPOINTS from '../constants/apiEndpoints';
import api from './api.service';

const getUserById = async (userId) => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_USER_DETAILS_BY_ID(userId));
    return res.data;
  } catch (e) {
    console.error('Get Patients Error:', e);
    throw e;
  }
};

const deleteUserByEmail = async (email) => {
  try {
    const res = await api.delete(API_ENDPOINTS.DELETE_USER_DETAILS_BY_EMAIL(email));
    return res.data;
  } catch (e) {
    console.error('Get Patients Error:', e);
    throw e;
  }
};




const userServices = {
  getUserById,
  deleteUserByEmail
};

export default userServices;
