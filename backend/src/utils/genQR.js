import QRCode from 'qrcode';
import { imageUploadUtil } from './cloudinary.js'; // Adjust the path as necessary

export async function generateQRCode(data, options = {}) {
  try {
    const qrCode = await QRCode.toDataURL(data, options);
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");

    // Upload to Cloudinary using the existing utility function
    const result = await imageUploadUtil(`data:image/png;base64,${base64Data}`);

    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error('Error generating or uploading QR code');
  }
}

