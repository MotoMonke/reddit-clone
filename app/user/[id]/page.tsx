import UserPage from "@/app/ui/components/user/userPage";
import { getUserPosts,getCommentedPosts,getVotedPosts,getUserById } from "@/app/lib/db";
export default async function Page({ params }: { params: Promise<{ id: number }> }){
    const userId = (await params).id;
    const createdPosts = await getUserPosts(0,userId);
    const commentedPosts = await getCommentedPosts(0,userId);
    const votedPosts = await getVotedPosts(0,userId);
    const user = await getUserById(userId);
    if(user===null){
        return <div>User not found</div>
    }
    const username = user.username;
    const imageUrl = user.profile_img_url===null?'/default_profile.svg':user.profile_img_url;
    return(
        <UserPage userId={userId} createdPosts={createdPosts} commentedPosts={commentedPosts} votedPosts={votedPosts} username={username} imageUrl={imageUrl}/>
    )
}