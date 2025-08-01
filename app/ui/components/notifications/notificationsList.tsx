import type { Notification } from "@/app/lib/types";
import NotificationCard from "./notificationCard";
interface NotificationListInterface{
    notifications:Notification[]
}
export default function NotificationList({notifications}:NotificationListInterface){
    return (
        <div >
            <button className="hover:cursor-pointer active:bg-red-500 m-5 bg-red-700 p-2 rounded-full">Clear all</button>
            {notifications.map(notification=>(
                <NotificationCard key={notification.id} notification={notification}/>
            ))}
        </div>
    )
}
