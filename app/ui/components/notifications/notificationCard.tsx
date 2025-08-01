import { Notification } from "@/app/lib/types"
import UserLink from "../user/userLink"
import Link from "next/link"
interface CardInterface{
    notification:Notification
}
export default function NotificationCard({notification}:CardInterface){
    return(
        <div className="p-5">
            {notification.comment_id===null&&<div>
                <div className="flex gap-2">
                    <UserLink userId={notification.author_id}/>
                    <p>commented under your post:</p>
                    <Link className="hover:underline text-blue-500" href={`/post/${notification.post_id}`}>link</Link>    
                </div>    
            </div>}
            {notification.comment_id!==null&&<div>
                <div className="flex gap-2">
                    <UserLink userId={notification.author_id}/>
                    <p>answered your comment under post:</p>
                    <Link className="hover:underline text-blue-500" href={`/post/${notification.post_id}`}>link</Link>
                </div>    
            </div>}
        </div>
    )
}