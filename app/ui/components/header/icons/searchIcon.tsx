'use client';
import Image from "next/image";
export default function SearchIcon(){
    return(
        <div className="ml-2 mr-2 h-full">
            <form className="relative w-full h-full flex align-middle pr-5" action="/search" method="GET">
                <Image className="absolute top-2 left-0.5 z-10" src="/search.svg" width={25} height={25} alt="Search icon"/>
                <input className="w-full bg-[#343434] pl-7 pr-2 rounded-full" name="q" placeholder="Search posts..." />
            </form>
        </div>
    )
}