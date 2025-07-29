'use client';
import Link from "next/link";
import { useActionState,useEffect,useState } from "react";
import { signup } from "../lib/actions/auth";
import { useRouter } from "next/navigation";
import { VisiblePassword,NotVisiblePassword } from "../ui/components/authForms/elements";
export default function Page(){
    const router = useRouter();
    const [state,formAction] = useActionState(signup,{});
    const [passwordIsVisible,setPasswordIsVisible] = useState(false);
    const [passwordValue,setPasswordValue] = useState("");
    useEffect(()=>{
        if(state.success){
           router.push("/login");
        }
    },[state])
    function handleClick(){
        setPasswordIsVisible(!passwordIsVisible);
    }
    function changePasswordValue(value:string){
        setPasswordValue(value)
    }
    return (
        <div className="flex flex-col items-center h-full">
            <form action={formAction}
                className="mt-20 flex flex-col w-full max-w-[500px] mx-auto border border-gray-400 p-4 gap-y-2 bg-[#1a1a1a] text-white rounded"
            >
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" required
                    className="border border-gray-400 rounded-2xl p-3 w-full mb-4"
                />
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" required
                    className="border border-gray-400 rounded-2xl p-3 w-full mb-4"
                />
                <label htmlFor="password">Password: </label>
                {passwordIsVisible&&<VisiblePassword changeState={handleClick} changePassword={changePasswordValue} password={passwordValue}/>}
                {!passwordIsVisible&&<NotVisiblePassword changeState={handleClick} changePassword={changePasswordValue} password={passwordValue}/>}
                <button
                     className="mt-3 mb-5 border border-gray-400 pl-4 pr-4 pt-2 pb-2 rounded-full active:bg-gray-400 hover:cursor-pointer"
                >Submit</button>
                {state.error && <p className="text-red-500">{state.error}</p>}
            </form>
            <p className="mt-5">
                Already have an account? 
                <Link href="/login" className="text-blue-500 active:text-blue-300"> Login</Link>
            </p>
        </div>
    )
}