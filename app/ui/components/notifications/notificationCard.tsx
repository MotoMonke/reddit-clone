import { EnrichedNotification } from "@/app/lib/types"
import UserLink from "../user/userLink"
import Link from "next/link"
interface CardInterface{
   enrichedNotification:EnrichedNotification
}
export default function NotificationCard({enrichedNotification}:CardInterface){
    return(
        <div className="p-5">
            {enrichedNotification.notification.comment_id===null&&<div>
                <div className="flex gap-2">
                    <UserLink userId={enrichedNotification.notification.author_id} username={enrichedNotification.authorUsername} profileImgUrl={enrichedNotification.authorProfPicUrl}/>
                    <p>commented under your post:</p>
                    <Link className="hover:underline text-blue-500" href={`/post/${enrichedNotification.notification.post_id}`}>link</Link>    
                </div>    
            </div>}
            {enrichedNotification.notification.comment_id!==null&&<div>
                <div className="flex gap-2">
                    <UserLink userId={enrichedNotification.notification.author_id} username={enrichedNotification.authorUsername} profileImgUrl={enrichedNotification.authorProfPicUrl}/>
                    <p>answered your comment under post:</p>
                    <Link className="hover:underline text-blue-500" href={`/post/${enrichedNotification.notification.post_id}`}>link</Link>
                </div>    
            </div>}
        </div>
    )
}