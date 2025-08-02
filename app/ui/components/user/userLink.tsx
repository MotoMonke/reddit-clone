import Image from "next/image";
import Link from "next/link";
interface UserLinkInterface{
    userId:number,
    username:string|null,
    profileImgUrl:string|null,
}
export default function UserLink({userId,profileImgUrl,username}:UserLinkInterface){
    const imageUrl = profileImgUrl===null?'/default_profile.svg':profileImgUrl;
    return(
        <div className="flex flex-row gap-2">
            <Image src={imageUrl} width={25} height={25} alt="user profile image" className="rounded-full"/>
            <Link href={`/user/${userId}`}>
                <span className="hover:underline">{username!==null?username:'deleted'}</span>
            </Link>
        </div>
    )
}