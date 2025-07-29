'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function CreatePostIcon(){
    const router = useRouter();
    return(
        <Image src="/new_post.svg" width={25} height={25} alt="Create new post icon" className="hover:cursor-pointer" onClick={()=>router.push('/createpost')}/>
    )
}