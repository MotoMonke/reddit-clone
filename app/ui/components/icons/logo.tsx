'use client'
import Image from "next/image"
import { redirect } from "next/navigation";
export default function Logo(){
    return(
        <Image src="/logo.svg" width={50} height={50} alt="Logo" className="hover:cursor-pointer" onClick={()=>redirect('/')}/>
    )
}