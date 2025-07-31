'use client'
import Image from "next/image"
import { useRouter } from "next/navigation";
export default function Logo(){
    const router = useRouter();
    return(
        <Image src="/logo.svg" width={50} height={50} alt="Logo" className="hover:cursor-pointer" onClick={()=>router.push('/')}/>
    )
}