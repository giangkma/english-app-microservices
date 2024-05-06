import { axios } from 'libs';

const URL = '/2fa';

export const twoFAApi = {
    enable: () => {
        return axios.post(`${URL}/enable`);
    },
    disable: otpToken => {
        return axios.post(`${URL}/disable`, { otpToken });
    },
    verify: otpToken => {
        return axios.post(`${URL}/verify`, { otpToken });
    },
};
