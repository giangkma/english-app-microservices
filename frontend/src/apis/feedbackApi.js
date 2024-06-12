import axiosClient from './axiosClient';

const URL = '/feedback';

const feedbackApi = {
  createNew: (data) => {
    return axiosClient.post(`${URL}/create`, data);
  },
};

export default feedbackApi;
