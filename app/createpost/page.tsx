'use client';
import { useActionState,useState } from "react";
import { createPost } from "../lib/actions/post";
export default function Page(){
    const [state,formAction,isPending] = useActionState(createPost,{});
    const [file,setFile] = useState<string | null>(null);
    function handleChange(e:any){
        setFile(URL.createObjectURL(e.target.files[0]));
    }
    return(
        <form action={formAction}>
            <label htmlFor="title">Title: </label>
            <input type="text" id="title" name="title" />
            <label htmlFor="text">Text: </label>
            <input type="text" id="text" name="text" />
            <label htmlFor="image">Image: </label>
            <input type="file" name="image" accept="image/*"   onChange={handleChange}/>
            {file && <img src={file} alt="Uploaded preview" />}
            <button>Post</button>
            {isPending&& <div>Processing request...</div>}
            {state.error && <p className="text-red-500">{state.error}</p>}
            {state.success && <p className="text-green-500">The post is successfuly created</p>}
        </form>
    )
}