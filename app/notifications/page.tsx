import NotificationList from "../ui/components/notifications/notificationsList";
import { verifyToken } from "../lib/jwt";
import { getNotifications} from "../lib/db";
import { redirect } from "next/navigation";
export default async function Page(){
    const userId = await verifyToken();
    if(userId===null){
        redirect('/login')
    }
    const notifications = await getNotifications(userId);
    if(typeof notifications === 'string'){
        return(
            <div>Something went wrong: {notifications}</div>
        )
    }
    return(
        <NotificationList enrichedNotifications={notifications}/>
    )
}