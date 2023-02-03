const cloudinary = require('cloudinary')
export async function upload(params:any) {
    const imageUrl =  await cloudinary.uploader
    .upload(params)
    return imageUrl.secure_url
}