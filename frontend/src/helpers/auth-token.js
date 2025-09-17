import axios from "axios";
import { deleteAuthToken, saveAuthToken } from "./localstorage";


export const saveToken = (access_token) => {
    setAuthToken(access_token)
    saveAuthToken(access_token)
}

const setAuthToken = (token) => {
    try {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    } catch (e) {
        console.log("Error while setup token", e);
    }
}

export const clearToken = () => {
    deleteAuthToken();
    clearAuthToken();
}

const clearAuthToken = () => {
    delete axios.defaults.headers.common['Authorization']
}

