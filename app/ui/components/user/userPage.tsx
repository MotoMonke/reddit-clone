'use client'
import { useState} from "react"
import PostList from "../postScroll/postList"
import { getUserPosts,getCommentedPosts,getVotedPosts } from "@/app/lib/db"
import { PostType } from "@/app/lib/types"
import Image from "next/image"
interface UserPageInterface{
    userId:number,
    createdPosts:PostType[],
    commentedPosts:PostType[],
    votedPosts:PostType[],
    username:string,
    imageUrl:string,
}
export default function UserPage({userId,createdPosts,commentedPosts,votedPosts,username,imageUrl}:UserPageInterface){
    // i didn't thought about better way to toggle betwen user posts comments and voted posts
    const [option,setOption] = useState<0|1|2>(0);
    //
    return(
        <div className="mt-5 flex flex-col gap-5">
            <div className="ml-10 flex gap-5 items-center">
                <Image className="rounded-xl" width={150} height={150} alt='profile image' src={imageUrl}/>
                <div className="text-3xl">{username}</div>
            </div>
            <div className="flex items-center gap-5 ml-10">
                {option===0&&<div className="hover:cursor-pointer hover:underline bg-gray-600 p-3 rounded-full">Posts</div>}
                {option!==0&&<div className="hover:cursor-pointer hover:underline" onClick={()=>setOption(0)}>Posts</div>}
                {option===1&&<div className="hover:cursor-pointer hover:underline bg-gray-600 p-3 rounded-full">Comments</div>}
                {option!==1&&<div className="hover:cursor-pointer hover:underline" onClick={()=>setOption(1)}>Comments</div>}
                {option===2&&<div className="hover:cursor-pointer hover:underline bg-gray-600 p-3 rounded-full">Voted</div>}
                {option!==2&&<div className="hover:cursor-pointer hover:underline" onClick={()=>setOption(2)}>Voted</div>}
            </div>
            {option===0&&<PostList initialPostsArray={createdPosts} fetchFn={(offset)=>getUserPosts(offset,userId)}/>}
            {option===1&&<PostList initialPostsArray={commentedPosts} fetchFn={(offset)=>getCommentedPosts(offset,userId)}/>}
            {option===2&&<PostList initialPostsArray={votedPosts} fetchFn={(offset)=>getVotedPosts(offset,userId)}/>}
        </div>
    )
}