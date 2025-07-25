'use client';
import { redirect } from "next/navigation";
import Image from "next/image";
import { useState,useEffect } from "react";
import { getAmountOfComments } from "@/app/lib/db";
type idType ={
    id:number
}
export default function ComentsIcon({id}:idType){
    const [commentsCount,setCommentsCount] = useState(0);
    useEffect(()=>{
        async function getCount(){
            const answer = await getAmountOfComments(id);
            setCommentsCount(answer!)
        }
        getCount();
    },[])
    return(
        <div>
            <Image src="/comments.svg" width={20} height={20} alt="Comments icon" className="hover:cursor-pointer" onClick={()=>redirect(`/posts/${id}`)}/>
            <div className="text-white">{commentsCount}</div>
        </div>
    )
}