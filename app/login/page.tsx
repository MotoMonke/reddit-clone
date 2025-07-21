'use client';
import {login} from "../lib/actions/auth"
import { useActionState,useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
export default function Page(){
    const router = useRouter();
    const [state,formAction] = useActionState(login,{});
    useEffect(()=>{
        if(state.success){
            router.push("/");
        }
    },[state])
    return(
        <>
            <form action={formAction}>
                <label htmlFor="email">Email: </label>
                <input type="emial" id="email" name="email" required />
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" required minLength={6} />
                <button>Submit</button>
                {state.error && <p className="text-red-500">{state.error}</p>}
            </form>
            <Link href="/signup">Signup</Link>
        </>
    )
}