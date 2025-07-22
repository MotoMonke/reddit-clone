'use client';
import Image from "next/image";
import { redirect } from "next/navigation";
export default function NotificationsIcon(){
    return(
        <Image src="/notifications.svg" width={25} height={25} alt="Notifications icon" className="hover:cursor-pointer" onClick={()=>redirect('/indev')}/>
    )
}