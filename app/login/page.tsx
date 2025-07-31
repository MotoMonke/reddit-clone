'use client';
import {login,lazyLogin} from "../lib/actions/auth"
import { useActionState,useEffect,useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { VisiblePassword,NotVisiblePassword } from "../ui/components/authForms/elements";
export default function Page(){
    const router = useRouter();
    const [state,formAction] = useActionState(login,{});
    const [lazyState,lazyFormAction] = useActionState(lazyLogin,{});
    const [passwordIsVisible,setPasswordIsVisible] = useState(false);
    const [passwordValue,setPasswordValue] = useState("");
    useEffect(()=>{
        if(state.success){
            router.push("/");
        }
    },[state,router])
    useEffect(()=>{
        if(lazyState.success){
            router.push("/");
        }
    },[lazyState,router])
    function handleClick(){
        setPasswordIsVisible(!passwordIsVisible);
    }
    function changePasswordValue(value:string){
        setPasswordValue(value)
    }
    return(
        <div className="flex flex-col items-center h-full">
            <form action={formAction}
                className="mt-20 flex flex-col w-full max-w-[500px] mx-auto border border-gray-400 p-4 gap-y-2 bg-[#1a1a1a] text-white rounded"
            >
                <label htmlFor="email">Email: </label>
                <input type="emial" id="email" name="email" required 
                    className="border border-gray-400 rounded-2xl p-3 w-full mb-4"
                />
                <label htmlFor="password">Password: </label>
                {passwordIsVisible&&<VisiblePassword changeState={handleClick} changePassword={changePasswordValue} password={passwordValue}/>}
                {!passwordIsVisible&&<NotVisiblePassword changeState={handleClick} changePassword={changePasswordValue} password={passwordValue}/>}
                <button
                    type="submit"
                    className="mt-3 mb-5 border border-gray-400 pl-4 pr-4 pt-2 pb-2 rounded-full active:bg-gray-400 hover:cursor-pointer"
                >Submit</button>
                {state.error && <p className="text-red-500">{state.error}</p>}
            </form>
            <form action={lazyFormAction}>
                <button type="submit" className="mt-3 hover:underline">Login as guest</button>
                {lazyState.error && <p className="text-red-500">{lazyState.error}</p>}
            </form>
            <p className="mt-5">
                Don&#39t have an account? 
                <Link href="/signup" className="text-blue-500 active:text-blue-300"> Signup</Link>
            </p>
        </div>
    )
}
