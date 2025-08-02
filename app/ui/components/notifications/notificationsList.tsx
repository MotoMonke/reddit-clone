import type { EnrichedNotification } from "@/app/lib/types";
import NotificationCard from "./notificationCard";
interface NotificationListInterface{
    enrichedNotifications:EnrichedNotification[]
}
export default function NotificationList({enrichedNotifications}:NotificationListInterface){
    return (
        <div >
            <button className="hover:cursor-pointer active:bg-red-500 m-5 bg-red-700 p-2 rounded-full">Clear all</button>
            {enrichedNotifications.map(enrichedNotification=>(
                <NotificationCard key={enrichedNotification.notification.id} enrichedNotification={enrichedNotification}/>
            ))}
        </div>
    )
}
