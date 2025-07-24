'use client';
import { redirect } from "next/navigation";
import Image from "next/image";
type idType ={
    id:number
}
export default function ComentsIcon({id}:idType){
    return(
        <Image src="/comments.svg" width={20} height={20} alt="Comments icon" className="hover:cursor-pointer" onClick={()=>redirect(`/posts/${id}`)}/>
    )
}