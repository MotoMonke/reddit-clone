import { getUserById } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";
interface UserLinkInterface{
    userId:number
}
export default async function UserLink({userId}:UserLinkInterface){
    const user = await getUserById(userId);
    if(user===null){
        return <div>User not found</div>
    }
    const imageUrl = user.profile_img_url===null?'/default_profile.svg':user.profile_img_url;
    return(
        <div className="flex flex-row gap-2">
            <Image src={imageUrl} width={25} height={25} alt="user profile image" className="rounded-full"/>
            <Link href={`/user/${userId}`}>
                <span className="hover:underline">{user.username}</span>
            </Link>
        </div>
    )
}