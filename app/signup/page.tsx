'use client';
import Link from "next/link";
import { useActionState,useEffect,useState } from "react";
import {redirect} from "next/navigation";
import { signup } from "../lib/actions/auth";
import { useRouter } from "next/navigation";
export default function Page(){
    const router = useRouter();
    const [state,formAction] = useActionState(signup,{});
    useEffect(()=>{
        if(state.success){
           router.push("/");
        }
    },[state])
    return (
        <>
            <form action={formAction}>
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" required />
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" required minLength={6} />
                <button>Submit</button>
                {state.error && <p className="text-red-500">{state.error}</p>}
            </form>
            <Link href="/login">Login</Link>
        </>
    )
}