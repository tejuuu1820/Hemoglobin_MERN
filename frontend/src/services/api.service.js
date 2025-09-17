import axios from "axios";
import { BASE_URL } from './../constants/index';

const api = axios.create({
    baseURL: BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${JSON.parse(token)}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api