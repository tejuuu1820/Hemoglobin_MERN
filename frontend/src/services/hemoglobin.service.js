import API_ENDPOINTS from '../constants/apiEndpoints';
import api from './api.service';

// ✅ Create patient
const addPatient = async (payload) => {
  try {
    const res = await api.post(API_ENDPOINTS.PATIENTS, payload);
    return res.data;
  } catch (e) {
    console.error('Add Patient Error:', e);
    throw e;
  }
};

// ✅ Fetch all patients
const getPatients = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.PATIENTS);
    return res.data;
  } catch (e) {
    console.error('Get Patients Error:', e);
    throw e;
  }
};

const getPatientsByUserId = async (userId) => {
  try {
    const res = await api.get(API_ENDPOINTS.PATIENTS_BY_USER_ID(userId));
    return res.data;
  } catch (e) {
    console.error('Get Patients Error:', e);
    throw e;
  }
};



// ✅ Fetch single patient by ID
const getPatientById = async (id) => {
  try {
    const res = await api.get(`${API_ENDPOINTS.PATIENTS}/${id}`);
    return res.data;
  } catch (e) {
    console.error('Get Patient Error:', e);
    throw e;
  }
};

// ✅ Update patient by ID
const updatePatient = async (id, payload) => {
  try {
    const res = await api.put(`${API_ENDPOINTS.PATIENTS}/${id}`, payload);
    return res.data;
  } catch (e) {
    console.error('Update Patient Error:', e);
    throw e;
  }
};

// ✅ Delete patient by ID
const deletePatient = async (id) => {
  try {
    const res = await api.delete(`${API_ENDPOINTS.PATIENTS}/${id}`);
    return res.data;
  } catch (e) {
    console.error('Delete Patient Error:', e);
    throw e;
  }
};

// Export all services
const hemoglobinService = {
  addPatient,
  getPatients,
  getPatientsByUserId,
  getPatientById,
  updatePatient,
  deletePatient,
};

export default hemoglobinService;
