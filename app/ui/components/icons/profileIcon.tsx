'use client';
import Image from "next/image";
import { redirect } from "next/navigation";
export default function ProfileIcon(){
    return(
        <Image src="/default_profile.svg" width={25} height={25} alt="Profile picture" className="hover:cursor-pointer" onClick={()=>redirect('/indev')}/>
    )
}