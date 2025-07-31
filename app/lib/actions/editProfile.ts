'use server';
import z from "zod";
import { verifyToken } from "../jwt";
import { uploadImage } from "../cloudinary";
import { editUser } from "../db";
const FormSchema = z.object({
  username: z.string(),
  email: z.email(),
  image: z
    .file()
    .max(5_000_000, "File too large") // Optional: file constraints
    .mime(["image/jpeg", "image/png"], "Only PNG or JPEG allowed")
    .nullable(),
});

type FormState = { error?: string; success?: boolean };
export async function editProfile(_prevState: FormState,formData: FormData):Promise<FormState>{
    const rawImage = formData.get("image");
    const rawUsername = formData.get("username");
    const rawEmail = formData.get("email");
    try {
        const parsed = FormSchema.parse({
            username:rawUsername,
            email:rawEmail, 
            image: rawImage instanceof File && rawImage.size > 0 ? rawImage : null,
        });
        const userId = await verifyToken();
        if(userId===null){
            return {error:'not logged in'}
        }
        //saving img to cloud
        let imageUrl;
        if(parsed.image === null){
            imageUrl=null;
        }else{
            //converting file to base64 string
            const buffer = Buffer.from(await parsed.image!.arrayBuffer());
            const base64 = buffer.toString("base64");
            const base64WithPrefix = `data:${parsed.image!.type};base64,${base64}`;
            //
            const cloudinaryAnswer = await uploadImage(base64WithPrefix);
            if(typeof cloudinaryAnswer === "string"){
                return {error:cloudinaryAnswer};
            }
            imageUrl=cloudinaryAnswer.secure_url;
        }
        const answer = await editUser(userId,parsed.username,parsed.email,imageUrl);
        if(answer!=='success!'){
            return {error:answer};
        }
        return {success:true};
    } catch (err) {
        if (err instanceof z.ZodError) {
            return { error: err.message };
        }
        return {error:`${err}`};
    }
}