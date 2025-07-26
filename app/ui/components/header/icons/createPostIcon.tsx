'use client';
import Image from "next/image";
import { redirect } from "next/navigation";
export default function CreatePostIcon(){
    return(
        <Image src="/new_post.svg" width={25} height={25} alt="Create new post icon" className="hover:cursor-pointer" onClick={()=>redirect('/createpost')}/>
    )
}