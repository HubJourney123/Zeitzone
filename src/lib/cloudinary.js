import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Image) {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: 'zeitzone',
    resource_type: 'image',
  });
  return result.secure_url;
}

export function getPublicId(url) {
  const parts = url.split('/');
  const withVersion = parts.slice(parts.indexOf('zeitzone')).join('/');
  return withVersion.split('.')[0];
}

export default cloudinary;
