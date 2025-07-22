'use client';
import Image from "next/image";
import { redirect } from "next/navigation";
export default function SearchIcon(){
    return(
        <Image src="/search.svg" width={25} height={25} alt="Search icon" className="hover:cursor-pointer" onClick={()=>redirect('/indev')}/>
    )
}