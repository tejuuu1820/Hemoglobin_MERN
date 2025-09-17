
import { isEmpty } from './common';
import { jwtDecode } from 'jwt-decode'
const USER_DETAILS_KEY = 'user';
const TOKEN_DETAILS_KEY = 'token'
export const isAuthenticated = () => {
    const auth = {
        user: getUserDetails(),
        token: getAuthToken()
    };

    if (!isEmpty(auth.token)) {
        const token = auth.token;
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
            return auth.user;
        } else {
            deleteAllLocalData();
            return null;
        }
    }
}

export const getUserDetails = () => {
    try {
        const user = localStorage.getItem(USER_DETAILS_KEY)
        if (user) return JSON.parse(user);
        return undefined
    } catch (e) {
        console.log(e.message);
    }
}

export const getAuthToken = () => {
    try {
        const token = localStorage.getItem(TOKEN_DETAILS_KEY);
        if (token) return JSON.parse(token);
        return undefined
    } catch (e) {
        console.log(e.message);
    }
}

export const deleteAllLocalData = () => {
    try {
        localStorage.removeItem(USER_DETAILS_KEY);
        localStorage.removeItem(TOKEN_DETAILS_KEY)
    } catch (e) {
        console.log(e.message);
    }
}

export const saveAuthToken = (data) => {
    try {
        var jsonOfItem = localStorage.setItem(TOKEN_DETAILS_KEY, JSON.stringify(data))
        return jsonOfItem
    } catch (e) {
        console.log(e.message);
    }
}

export const saveUserDetails = (data) => {
    try {
        var jsonOfItem = localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(data));
        return jsonOfItem
    } catch (e) {
        console.log(e.message);
    }
}

export const deleteAuthToken = () => {
    try {
        localStorage.removeItem(TOKEN_DETAILS_KEY)
    } catch (e) {
        console.log(e.message);
    }
}
