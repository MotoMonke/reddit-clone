//this component separates notifications and profile icons from the rest of navbar to render them conditionaly, when user is logged in
//else it will render login button which will redirect user to login page
import CreatePostIcon from "./headerIcons/createPostIcon";
import ProfileIcon from "./headerIcons/profileIcon";
import NotificationsIcon from "./headerIcons/notificationIcon";
import { verifyToken } from "@/app/lib/jwt";
import { getUserById,getNotificationsCount } from "@/app/lib/db";
import LoginButton from "./loginBtn";
export default async function UserControls(){
    const userId = await verifyToken();
    if(userId===null){
        return(
            <div className="w-40">
                <LoginButton/>
            </div>
        )
    }
    const user = await getUserById(userId!); 
    if(user===null){
        return(
            <div className="w-40">
                <LoginButton/>
            </div>
        )
    }
    const notificationsCount = await getNotificationsCount(userId);
    return(
        <div className="w-40">
            <div className="flex flex-row justify-between align-middle w-full h-full">
                <CreatePostIcon/>
                <NotificationsIcon userId={userId} count={notificationsCount!==null?notificationsCount:0}/> 
                <ProfileIcon userId={userId} imageUrl={user.profile_img_url}/>    
            </div>
        </div>
    )
}