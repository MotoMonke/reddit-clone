import { editProfile } from "@/app/lib/actions/editProfile";
import { useState ,useActionState } from "react";
import Image from "next/image";
interface EditFormInterface{
    imageUrl:string|null,
    username:string,
    email:string,
}
export default function EditForm({imageUrl,username,email}:EditFormInterface){
    const [state,formAction,isPending] = useActionState(editProfile,{});
    const [file,setFile] = useState<string>(imageUrl===null?'/default_profile.svg':imageUrl);
    const [inputUsername,setInputUsername] = useState(username);
    const [inputEmail,setInputEmail] = useState(email);
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        if (file) {
            setFile(URL.createObjectURL(file));
        }
    }
    return(
        <div className="flex flex-col">
            <form className="flex flex-col gap-3 mb-3" action={formAction}>
                {file && <Image src={file} className="rounded-4xl" alt="Uploaded preview" width={500} height={500} unoptimized/>}  
                <input id="file" type="file" name="image" accept="image/*" onChange={handleChange} 
                    className="mb-3 file:border-gray-400 file:border-1 file:rounded-2xl file:p-2 file:active:bg-gray-400"
                />
                <input className="border border-gray-400 p-3 rounded-full" type="text" name='username' value={inputUsername} onChange={(e)=>setInputUsername(e.target.value)} required placeholder="username" />
                <input className="border border-gray-400 p-3 rounded-full" type="email" name='email' value={inputEmail} onChange={(e)=>setInputEmail(e.target.value)} required placeholder="email" />
                <button className="active:bg-gray-400 hover:cursor-pointer hover:bg-gray-500 bg-gray-600 pt-2 pb-2 pr-4 pl-4 rounded-full" type="submit">Submit</button>
                {isPending&& <div>Processing request...</div>}
                {state.error && <p className="text-red-500">{state.error}</p>}
                {state.success && <p className="text-green-500">The profile was successfuly updated!</p>}
            </form>
        </div>
    )
}