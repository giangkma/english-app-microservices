const axios = require("axios");

exports.publishAccountEvent = async (payload) => {
  try {
    await axios.post("http://localhost:8000/account/app-events", {
      payload,
    });
  } catch (error) {
    console.error("Publish event ERROR: ", error);
  }
};
