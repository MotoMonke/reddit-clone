'use client'
import { PostType } from "@/app/lib/types"
import { searchPosts } from "@/app/lib/db"
import PostList from "./postScroll/postList"
interface SearchPageInterface{
    initialPosts:PostType[],
    query:string,
}
export default function SearchPage({initialPosts,query}:SearchPageInterface){
    return(
        <div>
        <div>Search results for &quot;{query}&quot;</div>
        {initialPosts.length > 0 && (
          <PostList
            initialPostsArray={initialPosts}
            fetchFn={(offset) => searchPosts(offset, query)}
          />
        )}
      </div>
    )
}