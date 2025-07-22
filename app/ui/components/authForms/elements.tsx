import { PasswordProps } from "@/app/lib/types"
import Image from "next/image"
export function NotVisiblePassword({ changeState, changePassword, password }: PasswordProps){
    return(
        <div className="relative w-full">
            <input type="password" id="password" name="password" required minLength={6} value={password} onChange={(e)=>changePassword(e.target.value)} 
            className="border border-gray-400 rounded-2xl p-3 w-full mb-4"/>
            <Image
                src="/eye.svg"
                width={20}
                height={20}
                alt="eye icon"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={changeState}
            />
        </div>
    )
}
export function VisiblePassword({ changeState, changePassword, password }: PasswordProps){
    return(
        <div className="relative w-full">
            <input type="text" id="password" name="password" required minLength={6} value={password} onChange={(e)=>changePassword(e.target.value)}
            className="border border-gray-400 rounded-2xl p-3 w-full mb-4"/>
            <Image
                src="/eye-off.svg"
                width={20}
                height={20}
                alt="eye-off icon"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={changeState}
            />
        </div>
    )
}