import type { PostType } from "@/app/lib/types"
export default function PostCard({...post}: PostType){
    return (
        <div className="flex flex-col mb-10">
            <div>Author id: {post.author_id}</div>
            <div>Title: {post.title}</div>
            {post.imageUrl!==null&&<div>{post.imageUrl}</div>}
            {post.text!==null&&<div>{post.text}</div>}
        </div>
    )
}