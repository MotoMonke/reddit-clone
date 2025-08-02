'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";
interface ComentsIconInterface{
    id:number,
    commentsCount:number,
}
export default function ComentsIcon({id,commentsCount}:ComentsIconInterface){
    const router = useRouter();
    return(
        <div className="flex flex-row bg-[#2A3236] pt-1 pb-1 justify-center rounded-full min-w-12">
            <Image src="/comments.svg" width={25} height={25} alt="Comments icon" className="hover:cursor-pointer ml-2" onClick={()=>router.push(`/post/${id}`)}/>
            <div className="text-white mr-3">{commentsCount}</div>
        </div>
    )
}