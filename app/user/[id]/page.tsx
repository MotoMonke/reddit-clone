import UserPage from "@/app/ui/components/user/userPage";
import { getUserPosts,getCommentedPosts,getVotedPosts,getUserById } from "@/app/lib/db";
import { verifyToken } from "@/app/lib/jwt";
export default async function Page({ params }: { params: Promise<{ id: number }> }){
    const userId = (await params).id;
    const user = await getUserById(userId);
    if(user===null){
        return <div>User not found</div>
    }
    const createdPosts = await getUserPosts(0,userId);
    const commentedPosts = await getCommentedPosts(0,userId);
    const votedPosts = await getVotedPosts(0,userId);
    const isVerifyed = await verifyToken();
    const username = user.username;
    const imageUrl = user.profile_img_url===null?'/default_profile.svg':user.profile_img_url;
    return(
        <UserPage isVerifyed={isVerifyed} userId={userId} createdPosts={createdPosts} commentedPosts={commentedPosts} votedPosts={votedPosts} username={username} imageUrl={imageUrl}/>
    )
}