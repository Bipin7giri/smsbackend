const cloudinary = require("cloudinary");
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const APIKey = process.env?.APIKey;
const APISecret = process.env?.APISecret;
const PINATA_ENDPOINT: any = process.env?.PINATA_ENDPOINT;
export async function uploadFile(params: any) {
  try {
    const imageUrl = await cloudinary.uploader.upload(params, {
      resource_type: "auto",
    });
    return imageUrl.secure_url;
  } catch (err) {
    throw err;
  }
}

// export async function uploadPdf(params:any) {
//     const response = await axios.post(PINATA_ENDPOINT, params, {
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//         headers: {
//           'Content-Type': `multipart/form-data;`,
//           'pinata_api_key': APIKey,
//           'pinata_secret_api_key': APISecret,
//         },
//       });
//       if (!response.data.IpfsHash) {
//         console.error(response.data);
//         // return res.status(500).json({error: 'Failed to upload file to Pinata'});
//       }
//       else{
//         return response.data.IpfsHash}
//       }
