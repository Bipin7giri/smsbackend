const jwt = require("jsonwebtoken");
require("dotenv").config();

const requestPromise = require("request-promise");
const payload = {
  iss: process.env.ZOOM_API_KEY,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, process.env.ZOOM_API_SECRET_KEY);

export const createMeetingApi = async (payload: any) => {
  let email = "bipingiri27@gmail.com"; // your zoom developer email account
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: payload?.title,
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };
  try {
    const res = await requestPromise(options);
    return res;
  } catch (err: any) {
    return err;
  }
};

// export const join
