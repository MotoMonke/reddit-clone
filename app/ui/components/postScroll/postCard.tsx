'use client'
import type { PostType } from "@/app/lib/types"
import Image from "next/image"
import ComentsIcon from "../header/icons/comentsIcon"
import Votes from "../votes/votes"
import UserLink from "../user/userLink"
interface PostCardInterface{
    post:PostType
}
export default function PostCard({post}: PostCardInterface){
    console.log(post.image_url)
    return (
        <div className="flex flex-col pt-8 max-w-[800px] pb-3 hover:bg-[#222222] border-b-1 border-b-gray-600">
            <UserLink userId={post.author_id}/>
            <div className="text-xl">{post.title}</div>
            {post.image_url!==null&&<Image className="w-full rounded-2xl" src={post.image_url!} width={1000} height={1000} alt="post image"/>}
            {post.text!==null&&<div className="text-[#8BA2AD]">{post.text}</div>}
            <div className="flex flex-row gap-5 mt-2.5">
                <Votes id={post.id} isPost={true}/>
                <ComentsIcon id={post.id}/>
            </div>
            
        </div>
    )
}