'use server';
import { z } from "zod";
import { insertPost } from "../db";
import { verifyToken } from "../jwt";
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
    const userId = await verifyToken();
    if(userId===null){
      return { error: "Not logged in" };
    }
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
    const answer = await insertPost(userId,parsed.title,parsed.text,imageUrl);
    if(answer!=='succes'){
      return {error:answer};
    }
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.message };
    }
    return { error: `Something went wrong: ${err}` };
  }
}

