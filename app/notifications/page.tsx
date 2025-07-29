'use client';
import { useState,useEffect } from "react";
import type { Notification } from "../lib/types";
import { getNotifications,deleteNotifications } from "../lib/db";
import { verifyToken } from "../lib/jwt";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    },[]);
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
            <button className="hover:cursor-pointer" onClick={clearAll}>Clear all</button>
            {notifications.map(notification=>(
                <NotificationCard notification={notification}/>
            ))}
        </div>
    )
}
interface CardInterface{
    notification:Notification
}
function NotificationCard({notification}:CardInterface){
    return(
        <div>
            {notification.comment_id===null&&<div>
                <div>
                    <Link className="hover:underline" href={`/user/${notification.author_id}`}>User {notification.author_id}</Link>
                    commented under your post
                    <Link className="hover:underline" href={`/post/${notification.post_id}`}>{notification.post_id}</Link>    
                </div>    
            </div>}
            {notification.comment_id!==null&&<div>
                <div>
                    <Link className="hover:underline" href={`/user/${notification.author_id}`}>User {notification.author_id}</Link>
                    answered your comment under post
                    <Link className="hover:underline" href={`/post/${notification.post_id}`}>{notification.post_id}</Link> 
                </div>    
            </div>}
        </div>
    )
}