import type { PostType } from "@/app/lib/types"
import Image from "next/image"
export default function PostCard({...post}: PostType){
    console.log(post.image_url)
    return (
        <div className="flex flex-col mb-10">
            <div>Author id: {post.author_id}</div>
            <div>Title: {post.title}</div>
            {post.image_url!==undefined&&<Image src={post.image_url!} width={100} height={100} alt="post image"/>}
            {post.text!==undefined&&<div>{post.text}</div>}
        </div>
    )
}