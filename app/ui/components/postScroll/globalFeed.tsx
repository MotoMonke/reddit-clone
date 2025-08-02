import { getPostsForGlobalFeed } from "@/app/lib/db"
import { EnrichedPost } from "@/app/lib/types";
import PostList from "./postList";
import { verifyToken } from "@/app/lib/jwt";
export async function GlobalFeed(){
    const initialPostsArray:EnrichedPost[] = await getPostsForGlobalFeed(0);
    const isVerifyed = await verifyToken();
    return(
        <PostList isVerifyed={isVerifyed} initialPostsArray={initialPostsArray} fetchFn={getPostsForGlobalFeed}/>
    )
}
