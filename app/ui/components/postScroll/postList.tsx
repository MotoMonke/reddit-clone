'use client';
import { useState,useEffect } from "react";
import { PostType } from "@/app/lib/types";
import PostCard from "./postCard";
import { getPosts } from "@/app/lib/db";
import { useInView } from "react-intersection-observer";
const number_of_posts_to_fetch = 10;
export default function PostList({ initialPostsArray }: { initialPostsArray: PostType[] }){
    const [posts, setPosts] = useState<PostType[]>(initialPostsArray);
    const [offset,setOffset] = useState(number_of_posts_to_fetch);
    const [hasMore,setHasMore] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const {ref,inView} = useInView();
    async function loadMorePosts(){
        setIsLoading(true);
        const newPosts = await getPosts(offset,number_of_posts_to_fetch);
        setPosts(posts=>[...posts,...newPosts]);
        setOffset(offset => offset + number_of_posts_to_fetch);
        if(newPosts.length<10){
            setHasMore(false);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        if (inView&&!isLoading&&hasMore) {
            loadMorePosts();
        }
    }, [inView])
    return(
        <div>
            {posts.map((post)=>(
                <PostCard key={post.id} {...post}/>
            ))}
            {hasMore&&<div ref={ref}>
                Loading...
            </div>}
        </div>
    )
}