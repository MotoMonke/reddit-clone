'use clinet';
import { useState,useEffect } from "react";
import { getUserById } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";
interface UserLinkInterface{
    userId:number
}
export default function UserLink({userId}:UserLinkInterface){
    const [username,setUsername] = useState('');
    const [imageUrl,setImageUrl] = useState('/default_profile.svg');
    useEffect(()=>{
        async function getUser(){
            const user = await getUserById(userId);
            if(user!==null){
                setUsername(user!.username);
                if(user.profile_img_url!==null){
                    setImageUrl(user.profile_img_url);
                }
            }
        }
        getUser();
    },[])
    return(
        <div className="flex flex-row gap-2">
            <Image src={imageUrl} width={25} height={25} alt="user profile image" className="rounded-full"/>
            <Link href={`/user/${userId}`}>
                <span className="hover:underline">{username}</span>
            </Link>
        </div>
    )
}