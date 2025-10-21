const API_ENDPOINTS = {
  PATIENTS: '/patients',
  PATIENTS_BY_USER_ID: (userId) => `/patients/me/${userId}`,

  GET_USER_DETAILS_BY_ID: (userId) => `/user/${userId}`,
  DELETE_USER_DETAILS_BY_EMAIL: (email) => `/user/${email}`,

  // App routes
  SIGNUP_API: '/auth/sign-up',
  LOGIN_API: '/auth/login',
  APP_USER_DETAILS_API: '/user/user-details',
  APP_FORGOT_PASSWORD_API: '/auth/forget-password',
  APP_RESET_PASSWORD_API: '/auth/reset-password',
};

export default API_ENDPOINTS;
