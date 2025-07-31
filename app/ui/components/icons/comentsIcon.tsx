'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState,useEffect } from "react";
import { getAmountOfComments } from "@/app/lib/db";
interface ComentsIconInterface{
    id:number
}
export default function ComentsIcon({id}:ComentsIconInterface){
    const router = useRouter();
    const [commentsCount,setCommentsCount] = useState(0);
    useEffect(()=>{
        async function getCount(){
            const answer = await getAmountOfComments(id);
            setCommentsCount(answer!)
        }
        getCount();
    },[])
    return(
        <div className="flex flex-row bg-[#2A3236] pt-1 pb-1 justify-center rounded-full min-w-12">
            <Image src="/comments.svg" width={25} height={25} alt="Comments icon" className="hover:cursor-pointer ml-2" onClick={()=>router.push(`/post/${id}`)}/>
            <div className="text-white mr-3">{commentsCount}</div>
        </div>
    )
}