'use client';
import Image from "next/image";
import { redirect } from "next/navigation";
export default function SearchIcon(){
    return(
        <div>
            <Image src="/search.svg" width={25} height={25} alt="Search icon" className="hover:cursor-pointer"/>
            <form action="/search" method="GET">
                <input className="w-10" name="q" placeholder="Search posts..." />
            </form>
        </div>
    )
}