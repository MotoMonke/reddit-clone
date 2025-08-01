'use client'
import type { Comment } from "@/app/lib/types";
import CommnetInput from "./commentInput";
import OneComment from "./comment";
import { useState } from "react";
interface CommentsTreeProps{
    comments:Comment[],
    postId:number
}

export default function CommentsTree({comments,postId}:CommentsTreeProps){
    const [commentArray,setCommentArray] = useState(comments);
    function onCommentCreated(newComment:Comment){
        setCommentArray(prev=>[...prev,newComment]);
    }
    return(
        <div className="rounded-md shadow">
            <div className="flex justify-center border-b">
                <div className="p-4 w-full max-w-[800px]">
                    <CommnetInput postId={postId} parentId={null} onCommentCreated={onCommentCreated} />
                </div>
            </div>
            <div className="divide-y divide-gray-200">
                {commentArray.map((comment)=>(
                    <OneComment key={comment.id} comment={comment} postId={postId}/>
                ))}
            </div>
        </div>
    )
}
