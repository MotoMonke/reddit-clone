'use client';
import { useState,useEffect } from "react";
import type { Notification } from "../lib/types";
import { getNotifications,deleteNotifications } from "../lib/db";
import { verifyToken } from "../lib/jwt";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserLink from "../ui/components/user/userLink";
export default function Page(){
    const router = useRouter();
    const [notifications,setNotifications] = useState<Notification[]>([]);
    const [error,setError] = useState('');
    const [id,setId] = useState<null|number>(null);
    useEffect(()=>{
        async function onMount(){
            const userId = await verifyToken();
            if(userId===null){
                router.push('/login');
            }
            setId(userId);
            const result = await getNotifications(userId!);
            if(typeof result === 'string'){
                setError(result);
            }else{
                setNotifications(result);
            }
        }
        onMount();
    },[router]);
    async function clearAll(){
        setNotifications([]);
        await deleteNotifications(id!);
    }
    if(error.length>0){
        return(
            <div>{error}</div>
        )
    }
    return (
        <div >
            <button className="hover:cursor-pointer active:bg-red-500 m-5 bg-red-700 p-2 rounded-full" onClick={clearAll}>Clear all</button>
            {notifications.map(notification=>(
                <NotificationCard key={notification.id} notification={notification}/>
            ))}
        </div>
    )
}
interface CardInterface{
    notification:Notification
}
function NotificationCard({notification}:CardInterface){
    return(
        <div className="p-5">
            {notification.comment_id===null&&<div>
                <div className="flex gap-2">
                    <UserLink userId={notification.author_id}/>
                    <p>commented under your post:</p>
                    <Link className="hover:underline text-blue-500" href={`/post/${notification.post_id}`}>link</Link>    
                </div>    
            </div>}
            {notification.comment_id!==null&&<div>
                <div className="flex gap-2">
                    <UserLink userId={notification.author_id}/>
                    <p>answered your comment under post:</p>
                    <Link className="hover:underline text-blue-500" href={`/post/${notification.post_id}`}>link</Link>
                </div>    
            </div>}
        </div>
    )
}