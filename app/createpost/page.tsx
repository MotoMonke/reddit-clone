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
        <div className="h-full flex flex-col items-center p-5">
            <h1 className="text-gray-400 text-3xl">Create post</h1>
            <form action={formAction}
            className="flex-col mt-5 w-full max-w-[700px]"
            >
                <div>
                    <input type="text" id="title" name="title" placeholder="Title" required
                        className="border border-gray-400 rounded-2xl p-3 w-full mb-4"
                    />
                </div>
                <div>
                    <textarea id="text" name="text" placeholder="Body text(optional)" 
                        className="border border-gray-400 rounded-2xl p-4 w-full h-40 mb-4"
                    />
                </div>
                <label htmlFor="file">Select image:</label>
                <input id="file" type="file" name="image" accept="image/*" onChange={handleChange} 
                    className="mb-3 file:border-gray-400 file:border-1 file:rounded-2xl file:p-2 file:active:bg-gray-400"
                />
                {file && <img src={file} alt="Uploaded preview" />}
                <div className="flex justify-end">
                    <button
                    className="mt-3 mb-5 border border-gray-400 pl-4 pr-4 pt-2 pb-2 rounded-full active:bg-gray-400"
                    >Post</button>
                </div>
                {isPending&& <div>Processing request...</div>}
                {state.error && <p className="text-red-500">{state.error}</p>}
                {state.success && <p className="text-green-500">The post is successfuly created</p>}
            </form>
        </div>
    )
}