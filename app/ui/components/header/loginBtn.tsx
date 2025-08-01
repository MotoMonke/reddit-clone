'use client'
import { useRouter } from "next/navigation"
export default function LoginButton(){
    const router = useRouter();
    return(
        <button onClick={()=>router.push('/login')} className="bg-red-700 w-20 rounded-full hover:cursor-pointer active:bg-red-600 pl-5 ml-8 h-full">Login</button>
    )
}