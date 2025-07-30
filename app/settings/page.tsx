'use client'
import { verifyToken } from "../lib/jwt";
import { getUserById } from "../lib/db";
import { useState,useEffect,useActionState } from "react"
import { useRouter } from "next/navigation";
import { editProfile } from "../lib/actions/editProfile";
import Image from "next/image";
export default function Page(){
    const router = useRouter();
    const [userId,setUserId] = useState<null|number>(null);
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [imageUrl,setImageUrl] = useState<null|string>('');
    const [loading,setLoading] = useState(true)
    const [edit,setEdit] = useState(false);
    useEffect(()=>{
        async function checkAuth(){
            setLoading(true);
            const result = await verifyToken();
            if(result===null){
                router.push('/login');
            }else{
                setUserId(result);
                const user = await getUserById(result);
                setUsername(user!.username);
                setEmail(user!.email);
                setImageUrl(user!.profile_img_url);
                setLoading(false);
            }
        }
        checkAuth();
    },[edit]);
    function changeEditState(){
        setEdit(prev=>!prev);
    }
    if(loading){
        return(
            <div>Loading...</div>
        )
    }
    console.log(imageUrl);
    return(
        <div className="flex justify-center m-5 ">
            {!edit&&<div>
                {imageUrl!==null&&<Image className="rounded-4xl" src={imageUrl} width={500} height={500} alt='Profile image' />}
                {imageUrl===null&&<Image src='/default_profile.svg' width={500} height={500} alt='Profile image'/>}
                <div>Username: {username}</div>
                <div>Email: {email}</div>
                <button className="active:bg-gray-400 hover:cursor-pointer hover:bg-gray-500 bg-gray-600 pt-2 pb-2 pr-4 pl-4 rounded-full" onClick={changeEditState}>Edit</button>    
            </div>}
            {edit&&<EditForm imageUrl={imageUrl} username={username} email={email} changeEditState={changeEditState}/>}
                
        </div>
    )
}
interface EditFormInterface{
    imageUrl:string|null,
    username:string,
    email:string,
    changeEditState:()=>void,
}
function EditForm({imageUrl,username,email,changeEditState}:EditFormInterface){
    const [state,formAction,isPending] = useActionState(editProfile,{});
    const [file,setFile] = useState<string>(imageUrl===null?'/default_profile.svg':imageUrl);
    const [inputUsername,setInputUsername] = useState(username);
    const [inputEmail,setInputEmail] = useState(email);
    function handleChange(e:any){
        setFile(URL.createObjectURL(e.target.files[0]));
    }
    return(
        <div className="flex flex-col">
            <form className="flex flex-col gap-3 mb-3" action={formAction}>
                {file && <img src={file} className="rounded-4xl" alt="Uploaded preview" width={500} height={500} />}  
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
            <button className="active:bg-gray-400 hover:cursor-pointer hover:bg-gray-500 bg-gray-600 pt-2 pb-2 pr-4 pl-4 rounded-full" onClick={changeEditState}>Go back</button>
        </div>
    )
}