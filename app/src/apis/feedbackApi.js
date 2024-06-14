import { axios } from 'libs';

const URL = '/feedback';

export const feedbackApi = {
    getList: () => {
        return axios.get(`${URL}/list`);
    },

    delete: id => {
        return axios.delete(`${URL}/delete/${id}`);
    },
};
