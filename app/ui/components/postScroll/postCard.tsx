'use client'
import type { PostType } from "@/app/lib/types"
import Image from "next/image"
import ComentsIcon from "../header/icons/comentsIcon"
import Votes from "../votes/votes"
export default function PostCard({...post}: PostType){
    console.log(post.image_url)
    return (
        <div className="flex flex-col mb-10">
            <div>Author id: {post.author_id}</div>
            <div>Title: {post.title}</div>
            {post.image_url!==null&&<Image src={post.image_url!} width={100} height={100} alt="post image"/>}
            {post.text!==null&&<div>{post.text}</div>}
            <ComentsIcon id={post.id}/>
            <Votes id={post.id} isPost={true}/>
        </div>
    )
}