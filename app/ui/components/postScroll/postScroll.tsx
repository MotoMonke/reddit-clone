import { getPosts } from "@/app/lib/db"
import { PostType } from "@/app/lib/types";
import PostList from "./postList";
const inital_number_of_posts = 10;
export async function PostsScroll(){
    const initialPostsArray:PostType[] = await getPosts(0,inital_number_of_posts,null,null);
    console.log(initialPostsArray);
    return(
        <PostList initialPostsArray={initialPostsArray} userId={null} type={null}/>
    )
}
