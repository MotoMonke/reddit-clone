'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import {markNotificationsAsRead } from "@/app/lib/db";
interface NotificationsInterface{
    userId:number,
    count:number
}
export default function NotificationsIcon({count,userId}:NotificationsInterface){
    const router = useRouter();
    let notificationCount = count;
    async function handleClick(){
        markNotificationsAsRead(userId);
        notificationCount=0;
        router.push('/notifications');
    }
    return(
        <div className="relative flex align-middle">
            <Image src="/notifications.svg" width={25} height={25} alt="Notifications icon" className="hover:cursor-pointer" onClick={handleClick}/>
            <div className="absolute top-5 left-5 text-red-600">{notificationCount<=9?notificationCount:'9+'}</div>
        </div>
    )
}