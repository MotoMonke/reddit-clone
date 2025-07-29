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
        <div>
            {!edit&&<div>
                {imageUrl!==null&&<Image src={imageUrl} width={100} height={100} alt='Profile image' />}
                {imageUrl===null&&<Image src='/default_profile.svg' width={100} height={100} alt='Profile image'/>}
                <div>{username}</div>
                <div>{email}</div>
                <button className="hover:cursor-pointer" onClick={changeEditState}>Edit</button>    
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
        <div>
            <form action={formAction}>
                {file && <img src={file} alt="Uploaded preview" width={100} height={100} />}  
                <input id="file" type="file" name="image" accept="image/*" onChange={handleChange} 
                    className="mb-3 file:border-gray-400 file:border-1 file:rounded-2xl file:p-2 file:active:bg-gray-400"
                />
                <input type="text" name='username' value={inputUsername} onChange={(e)=>setInputUsername(e.target.value)} required placeholder="username" />
                <input type="email" name='email' value={inputEmail} onChange={(e)=>setInputEmail(e.target.value)} required placeholder="email" />
                <button type="submit">Submit</button>
                {isPending&& <div>Processing request...</div>}
                {state.error && <p className="text-red-500">{state.error}</p>}
                {state.success && <p className="text-green-500">The profile was successfuly updated!</p>}
            </form>
            <button onClick={changeEditState}>Go back</button>
        </div>
    )
}