'use server';
import { z } from "zod";
import { insertPost } from "../db";
import { cookies } from 'next/headers';
import { jwtVerify } from "jose";
import type { Payload } from "../types";
import { uploadImage } from "../cloudinary";
const FormSchema = z.object({
  title: z.string(),
  text: z.string().nullable(),
  image: z
    .file()
    .max(5_000_000, "File too large") // Optional: file constraints
    .mime(["image/jpeg", "image/png"], "Only PNG or JPEG allowed")
    .nullable(),
});

type FormState = { error?: string; success?: boolean };

export async function createPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawTitle = formData.get("title");
  const rawText = formData.get("text");
  const rawImage = formData.get("image");

  if (!rawTitle) {
    return { error: "Title is required" };
  }
  try {
    const parsed = FormSchema.parse({
      title: rawTitle,
      text: typeof rawText === "string" && rawText.length>0 ? rawText : null,
      image: rawImage instanceof File && rawImage.size > 0 ? rawImage : null,
    });
    //geting user id
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const verifyed = await jwtVerify(token!,new TextEncoder().encode(process.env.JWT_SECRET));
    const payload = verifyed.payload as Payload;
    //
    let imageUrl;
    console.log(parsed.image);
    if(parsed.image === null){
      imageUrl=null;
    }else{
      //converting file to base64 string
      const buffer = Buffer.from(await parsed.image!.arrayBuffer());
      const base64 = buffer.toString("base64");
      const base64WithPrefix = `data:${parsed.image!.type};base64,${base64}`;
      console.log(base64WithPrefix);
      //
      const cloudinaryAnswer = await uploadImage(base64WithPrefix);
      if(typeof cloudinaryAnswer === "string"){
        return {error:cloudinaryAnswer};
      }
      imageUrl=cloudinaryAnswer.secure_url;
    }
    const answer = await insertPost(payload.userId,parsed.title,parsed.text,imageUrl);
    if(answer!=='succes'){
      return {error:answer};
    }
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(`error ${err.message}`)
      return { error: err.message };
    }
    console.log(err);
    return { error: "Something went wrong." };
  }
}

