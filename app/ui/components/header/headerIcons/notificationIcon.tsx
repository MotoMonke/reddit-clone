'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { getNotificationsCount,markNotificationsAsRead } from "@/app/lib/db";
interface NotificationsInterface{
    userId:number
}
export default function NotificationsIcon({userId}:NotificationsInterface){
    const router = useRouter();
    const [count,setCount] = useState(0);
    useEffect(()=>{
        async function getCount(){
            const count = await getNotificationsCount(userId);
            if(count!==null){
                setCount(count);
            }
        }
        getCount();
    },[userId])
    async function handleClick(){
        setCount(0);
        await markNotificationsAsRead(userId);
        router.push('/notifications');
    }
    return(
        <div className="relative flex align-middle">
            <Image src="/notifications.svg" width={25} height={25} alt="Notifications icon" className="hover:cursor-pointer" onClick={handleClick}/>
            <div className="absolute top-5 left-5 text-red-600">{count<=9?count:'9+'}</div>
        </div>
    )
}