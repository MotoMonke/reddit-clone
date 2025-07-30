'use client';
import { useState,useEffect } from "react";
import { PostType } from "@/app/lib/types";
import PostCard from "./postCard";

import { useInView } from "react-intersection-observer";
interface PostListInterface{
    initialPostsArray: PostType[],
    fetchFn:(offset:number) => Promise<PostType[]>;
}
export default function PostList({ initialPostsArray,fetchFn }:PostListInterface){
    const [posts, setPosts] = useState<PostType[]>(initialPostsArray);
    const [offset,setOffset] = useState(10);
    const [hasMore,setHasMore] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const {ref,inView} = useInView();
    async function loadMorePosts(){
        setIsLoading(true);
        const newPosts = await fetchFn(offset);
        setPosts(posts=>[...posts,...newPosts]);
        setOffset(offset => offset + 10);
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
    if(initialPostsArray.length===0){
        return(
            <div>
                No posts found
            </div>
        )
    }
    return(
       <div className="flex justify-center w-full">
         <div className="flex flex-col ml-10 mr-10">
            {posts.map((post)=>(
                <PostCard key={post.id} post={post}/>
            ))}
            {hasMore&&<div ref={ref}>
                Loading...
            </div>}
        </div>
       </div>
    )
}