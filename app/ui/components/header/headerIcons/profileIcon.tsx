'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { logout } from "@/app/lib/actions/auth";
import { getUserById } from "@/app/lib/db";
import { User } from "@/app/lib/types";
interface ProfileIconInterface{
    userId:number
}
export default function ProfileIcon({userId}:ProfileIconInterface){
    const router = useRouter();
    const [open,setOpen] = useState(false);
    const [imageUrl,setImageUrl] = useState('');
    useEffect(()=>{
        async function getImageUrl(){
            const user:User|null = await getUserById(userId);
            if(user===null){
                router.push('/');
            }else if(user.profile_img_url===null){
                return;
            }else{
                setImageUrl(user.profile_img_url);
            }
        }
        getImageUrl();
    },[router,userId])
    async function handleClick(){
        await logout();
        router.push('/');
    }
    return(
        <div className="relative flex align-middle">
            {imageUrl.length>0?(<Image src={imageUrl} width={25} height={25} alt="Profile picture" className="hover:cursor-pointer rounded-full" onClick={()=>setOpen(prev=>!prev)}/>):
            (<Image src="/default_profile.svg" width={25} height={25} alt="Profile picture" className="hover:cursor-pointer" onClick={()=>setOpen(prev=>!prev)}/>)}
            {open && (
                <div className="absolute top-10 right-[-18] mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                    <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>router.push(`/user/${userId}`)}>Profile</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>router.push('/settings')}>Settings</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleClick}>Log out</li>
                    </ul>
                </div>
            )}
        </div>
    )
}