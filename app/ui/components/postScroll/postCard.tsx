'use client'
import type { EnrichedPost } from "@/app/lib/types"
import Image from "next/image"
import ComentsIcon from "../icons/comentsIcon"
import Votes from "../votes/votes"
import UserLink from "../user/userLink"
interface PostCardInterface{
    enrichedPost:EnrichedPost,
    userId:number|null
}
export default function PostCard({enrichedPost,userId}: PostCardInterface){
    return (
        <div className="flex flex-col w-full pt-8 max-w-[800px] pb-3 hover:bg-[#222222] border-b-1 border-b-gray-600">
            <UserLink userId={enrichedPost.post.author_id} username={enrichedPost.authorUsername} profileImgUrl={enrichedPost.authorProfPicUrl}/>
            <div className="text-xl break-words w-full">{enrichedPost.post.title}</div>
            {enrichedPost.post.image_url!==null&&<Image className="w-full rounded-2xl" src={enrichedPost.post.image_url!} width={1000} height={1000} alt="post image"/>}
            {enrichedPost.post.text!==null&&<div className="text-[#8BA2AD] break-words w-full">{enrichedPost.post.text}</div>}
            <div className="flex flex-row gap-5 mt-2.5">
                <Votes userId={userId} id={enrichedPost.post.id} isPost={true} initialVote={enrichedPost.voted} likes={enrichedPost.upvotesAmount} dislikes={enrichedPost.downvotesAmount}/>
                <ComentsIcon id={enrichedPost.post.id} commentsCount={enrichedPost.commentsAmount}/>
            </div>
            
        </div>
    )
}