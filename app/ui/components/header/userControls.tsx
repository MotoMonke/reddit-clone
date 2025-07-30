//this component separates notifications and profile icons from the rest of navbar to render them conditionaly, when user is logged in
//else it will render login button which will redirect user to login page
'use client'
import { useState,useEffect } from "react";
import CreatePostIcon from "./icons/createPostIcon";
import ProfileIcon from "./icons/profileIcon";
import NotificationsIcon from "./icons/notificationIcon";
import { verifyToken } from "@/app/lib/jwt";
import { useRouter } from "next/navigation";
export default function UserControls(){
    const router = useRouter();
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [userId,setUserId] = useState<null|number>(null);
    useEffect(()=>{
        async function checkLogin(){
            const result = await verifyToken();
            if(result===null){
                setIsLoggedIn(false);
            }else{
                setIsLoggedIn(true);
                setUserId(result);
            }
        }
        checkLogin();
    });
    function handleClick(){
        router.push('/login');
    }
    return(
        <div className="align-middle w-40">
            {isLoggedIn&&
            <div className="flex flex-row justify-between align-middle w-full h-full">
                {/*if userId is null that means isLoggedIn is false so this elements will not render, so it's safe to pass userId(null|number) here */}
                <CreatePostIcon/>
                <NotificationsIcon userId={userId!}/> 
                <ProfileIcon userId={userId!}/>    
            </div>}
            {!isLoggedIn&&<div className="hover:cursor-pointer" onClick={handleClick}>Login</div>}
        </div>
    )
}