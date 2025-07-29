import { getPostsForGlobalFeed } from "@/app/lib/db"
import { PostType } from "@/app/lib/types";
import PostList from "./postList";
export async function GlobalFeed(){
    const initialPostsArray:PostType[] = await getPostsForGlobalFeed(0);
    return(
        <PostList initialPostsArray={initialPostsArray} fetchFn={getPostsForGlobalFeed}/>
    )
}
