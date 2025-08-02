'use client'
import type { Comment,CommentNode, User } from "@/app/lib/types";
import CommnetInput from "./commentInput";
import OneComment from "./comment";
import { useState } from "react";
interface CommentsTreeProps{
    enrichedComments:CommentNode[],
    postId:number,
    userId:number|null,
}
interface functionInterface{
        comment:Comment,
        author:User,
}
export default function CommentsTree({enrichedComments,postId,userId}:CommentsTreeProps){
    const [commentArray,setCommentArray] = useState(enrichedComments);
    function onCommentCreated({comment,author}:functionInterface){
        //enriching comment to match commentArray data type
        
        const commentNode:CommentNode = {
            comment:comment,
            upvotesAmount:0,
            downvotesAmount:0,
            voted:null,
            authorUsername:author.username,
            authorProfPicUrl:author.profile_img_url,
            children:[]
        }
        setCommentArray(prev=>[...prev,commentNode])
    }
    return(
        <div className="rounded-md shadow">
            <div className="flex justify-center border-b">
                <div className="p-4 w-full max-w-[800px]">
                    <CommnetInput postId={postId} parentId={null} onCommentCreated={onCommentCreated} userId={userId}/>
                </div>
            </div>
            <div className="divide-y divide-gray-200">
                {commentArray.map((enrichedComment)=>(
                    <OneComment key={enrichedComment.comment.id} enrichedComment={enrichedComment} postId={postId} userId={userId}/>
                ))}
            </div>
        </div>
    )
}
