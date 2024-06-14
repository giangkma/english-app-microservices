import { axios } from 'libs';

const URL = '/account';

export const accountApi = {
    postRegisterAccount: data => {
        return axios.post(`${URL}/register`, data);
    },

    postLogin: data => {
        return axios.post(`${URL}/login`, data);
    },

    postLoginWithGoogle: access_token => {
        return axios.post(`${URL}/login-gg`, { access_token });
    },

    postLoginWithFacebook: access_token => {
        return axios.post(`${URL}/login-fb`, { access_token });
    },

    postResetPassword: data => {
        return axios.post(`${URL}/reset-password`, data);
    },

    putToggleWordFavorite: data => {
        return axios.put(`${URL}/toggle-favorite`, data);
    },

    putUpdateUserCoin: newCoin => {
        return axios.put(`${URL}/update-coin`, { newCoin });
    },

    putUpdateAvt: avtSrc => {
        return axios.put(`${URL}/update-avt`, { avtSrc });
    },

    putUpdateProfile: data => {
        return axios.put(`${URL}/update-profile`, data);
    },

    getUserInfo: () => {
        return axios.get(`${URL}/user-info`);
    },

    getSendVerifyCode: username => {
        return axios.post(`${URL}/send-verify-code`, {
            username,
        });
    },

    getUserProfile: () => {
        return axios.get(`${URL}/user-profile`);
    },
};
