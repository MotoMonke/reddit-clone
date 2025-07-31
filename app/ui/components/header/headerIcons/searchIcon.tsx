'use client';
import Image from "next/image";

export default function SearchIcon(){
    return(
        <div className="mx-2 h-full flex-1 max-w-2xl">
            <form className="relative h-full flex items-center" action="/search" method="GET">
                <Image 
                    className="absolute left-3 z-10" 
                    src="/search.svg" 
                    width={20} 
                    height={20} 
                    alt="Search icon"
                />
                <input 
                    className="w-full h-10 bg-[#2A3236] pl-10 pr-4 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-gray-500" 
                    name="q" 
                    placeholder="Search posts..." 
                />
            </form>
        </div>
    )
}