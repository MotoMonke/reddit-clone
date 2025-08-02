'use client';
import { useState,useEffect } from "react";
import { EnrichedPost } from "@/app/lib/types";
import PostCard from "./postCard";

import { useInView } from "react-intersection-observer";
interface PostListInterface{
    initialPostsArray: EnrichedPost[],
    fetchFn:(offset:number) => Promise<EnrichedPost[]>,
    isVerifyed:number|null,
}
export default function PostList({ initialPostsArray,fetchFn,isVerifyed }:PostListInterface){
    const [enrichedPosts, setEnrichedPosts] = useState<EnrichedPost[]>(initialPostsArray);
    const [offset,setOffset] = useState(10);
    const [hasMore,setHasMore] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const {ref,inView} = useInView();
    async function loadMorePosts(){
        setIsLoading(true);
        const newPosts = await fetchFn(offset);
        setEnrichedPosts(posts=>[...posts,...newPosts]);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {enrichedPosts.map((enrichedPost)=>(
                <PostCard key={enrichedPost.post.id} enrichedPost={enrichedPost} userId={isVerifyed}/>
            ))}
            {hasMore&&<div ref={ref}>
                Loading...
            </div>}
        </div>
       </div>
    )
}