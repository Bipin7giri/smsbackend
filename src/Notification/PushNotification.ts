let axios = require("axios");



export const  sendNotification = async (data:any):Promise<any>=> {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.expo.dev/v2/push/send",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
 const result = await axios(config)
      .then(function (response: any) {
          return response.data
        console.table(JSON.stringify(response.data));
      })
      .catch(function (error: any) {
        console.log(error.message);
      });
 return  result;
}

