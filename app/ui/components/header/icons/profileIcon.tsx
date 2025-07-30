'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/lib/actions/auth";
interface ProfileIconInterface{
    userId:number
}
export default function ProfileIcon({userId}:ProfileIconInterface){
    const router = useRouter();
    const [open,setOpen] = useState(false);
    async function handleClick(){
        await logout();
        router.push('/');
    }
    return(
        <div className="flex align-middle">
            <Image src="/default_profile.svg" width={25} height={25} alt="Profile picture" className="hover:cursor-pointer" onClick={()=>setOpen(prev=>!prev)}/>
            {open && (
                <div className="fixed right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
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