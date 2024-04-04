const axios = require("axios");

exports.publishAccountEvent = (payload) => {
  try {
    return axios.post("http://localhost:8000/account/app-events", {
      payload,
    });
  } catch (error) {
    console.error("Publish event ERROR: ", error);
  }
};
