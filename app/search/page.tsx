'use client';
import PostList from "../ui/components/postScroll/postList";
import { searchPosts } from "../lib/db";
import { PostType } from "../lib/types";
import { useSearchParams } from "next/navigation";
import { useState,useEffect } from "react";
export default function Page(){
    const [initialPosts,setInitialPosts] = useState<PostType[]>([]);
    const searchParams = useSearchParams();
    const query = searchParams.get('q')||"";
    useEffect(()=>{
        async function getInitialPosts(){
            const result:PostType[] = await searchPosts(0,query);
            setInitialPosts(result);
        }
        getInitialPosts();
    },[query])
    return(
        <div>
            <div>Search results for &#34{query}&#34</div>
            {initialPosts.length>0&&<PostList initialPostsArray={initialPosts} fetchFn={(offset) => searchPosts(offset,query)}/>}
        </div>
    )
}