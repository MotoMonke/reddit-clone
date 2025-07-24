'use client';
import type { Comment } from "@/app/lib/types";
import CommnetInput from "./commentInput";
import { useState } from "react";
interface CommentsTreeProps{
    comments:Comment[],
    postId:number
}
interface OneCommentProps{
    comment:Comment,
    postId:number,
    onCommentCreated?:(newComment:Comment)=>void
}
export default function CommentsTree({comments,postId}:CommentsTreeProps){
    const [commentArray,setCommentArray] = useState(comments);
    function onCommentCreated(newComment:Comment){
        setCommentArray(prev=>[...prev,newComment]);
    }
    return(
        <div>
            <div className="mb-10"><CommnetInput postId={postId} parentId={null} onCommentCreated={onCommentCreated}/></div>
            {commentArray.map((comment)=>(
                <OneComment key={comment.id} comment={comment} postId={postId}/>
            ))}
        </div>
    )
}
function OneComment({comment,postId}:OneCommentProps){
    const [commentArray,setCommentArray] = useState(comment.children||[]);
    function onCommentCreated(newComment:Comment){
        setCommentArray(prev=>[...prev,newComment]);
    }
    return(
        <div className="ml-10">
            <p>{comment.body}</p>
            <CommnetInput postId={postId} parentId={comment.id} onCommentCreated={onCommentCreated} />
            {commentArray && commentArray.length>0 && (
                <div>
                    {commentArray.map((child)=>(
                        <OneComment key={child.id} postId={postId} comment={child} onCommentCreated={onCommentCreated}/>
                    ))}
                </div>
            )}
        </div>
    )
}