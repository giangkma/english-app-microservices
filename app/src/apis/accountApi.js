import { axios } from 'libs';

const URL = '/account';

export const accountApi = {
    postRegisterAccount: ({ email, name, password, username }) => {
        return axios.post(`${URL}/register`, {
            email,
            name,
            username,
            password,
        });
    },

    postLogin: ({ username, password, otpToken }) => {
        return axios.post(`${URL}/login`, { username, password, otpToken });
    },

    postLoginWithGoogle: access_token => {
        return axios.post(`${URL}/login-gg`, { access_token });
    },

    postLoginWithFacebook: access_token => {
        return axios.post(`${URL}/login-fb`, { access_token });
    },

    postResetPassword: ({ username, password, verifyCode }) => {
        return axios.post(`${URL}/reset-password`, {
            username,
            password,
            verifyCode,
        });
    },

    putToggleWordFavorite: ({ username, word, isAdd }) => {
        return axios.put(`${URL}/toggle-favorite`, {
            username,
            word,
            isAdd,
        });
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
