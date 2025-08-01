import { verifyToken } from "../lib/jwt";
import { getUserById } from "../lib/db";
import { redirect } from "next/navigation";
import { logout } from "../lib/actions/auth";
import SettingsPage from "../ui/components/settings/settingsPage";
export default async function Page(){
    const userId = await verifyToken();
    if(userId===null){
        redirect('/login')
    }
    const user = await getUserById(userId);
    if(user===null){
        logout();
        return(
            <div>No user with your id</div>
        )
    }
    return(
        <SettingsPage user={user}/>
    )
    
}