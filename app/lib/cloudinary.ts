import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true,
});
export async function uploadImage(image:string){
    try {
        const results = await cloudinary.uploader.upload(image);
        return results;  
    } catch (error) {
        console.log(error);
        return `cloudinary error message: ${error}`
    } 
}
