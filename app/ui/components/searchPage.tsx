'use client'
import { EnrichedPost } from "@/app/lib/types"
import { searchPosts } from "@/app/lib/db"
import PostList from "./postScroll/postList"
interface SearchPageInterface{
    initialPosts:EnrichedPost[],
    query:string,
    isVerifyed:number|null
}
export default function SearchPage({initialPosts,query,isVerifyed}:SearchPageInterface){
    return(
        <div>
        <div>Search results for &quot;{query}&quot;</div>
        {initialPosts.length > 0 && (
          <PostList
            initialPostsArray={initialPosts}
            fetchFn={(offset) => searchPosts(offset, query)}
            isVerifyed={isVerifyed}
          />
        )}
      </div>
    )
}