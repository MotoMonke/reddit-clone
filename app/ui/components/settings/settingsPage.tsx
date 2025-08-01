'use client'
import { useState } from "react"
import EditForm from "./editForm";
import Image from "next/image";
import { User } from "@/app/lib/types";
interface SettingsPageInterface{
    user:User
}
export default function SettingsPage({user}:SettingsPageInterface){
    const [edit,setEdit] = useState(false);
    return(
        <div className="flex justify-center m-5 ">
            {!edit&&<div>
                {user.profile_img_url!==null&&<Image className="rounded-4xl" src={user.profile_img_url} width={500} height={500} alt='Profile image' />}
                {user.profile_img_url===null&&<Image src='/default_profile.svg' width={500} height={500} alt='Profile image'/>}
                <div>Username: {user.username}</div>
                <div>Email: {user.email}</div>
                <button className="active:bg-gray-400 hover:cursor-pointer hover:bg-gray-500 bg-gray-600 pt-2 pb-2 pr-4 pl-4 rounded-full" onClick={()=>setEdit(true)}>Edit</button>    
            </div>}
            {edit&&<EditForm imageUrl={user.profile_img_url} username={user.username} email={user.email}/>}
        </div>
    )
}
