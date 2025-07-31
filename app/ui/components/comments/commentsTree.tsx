'use client';
import type { Comment } from "@/app/lib/types";
import CommnetInput from "./commentInput";
import { useState } from "react";
import Votes from "../votes/votes";
import UserLink from "../user/userLink";
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
function OneComment({comment,postId}:OneCommentProps){
    const [commentArray,setCommentArray] = useState(comment.children||[]);
    const [isExpanded, setIsExpanded] = useState(true);
    
    function onCommentCreated(newComment:Comment){
        setCommentArray(prev=>[...prev,newComment]);
    }
    
    return(
        <div className={`pl-10 py-3 ${isExpanded ? '' : 'opacity-60'}`}>
            <div className="flex items-start gap-2">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-500 rounded"
                >
                    {isExpanded ? '-' : '+'}
                </button>
                
                <div className="flex-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <UserLink userId={comment.author_id} />
                        <span>•</span>
                        <span>{new Date(comment.created_at!).toLocaleString()}</span>
                    </div>
                    
                    {isExpanded && (
                        <>
                            <p className="mb-2">{comment.body}</p>
                            
                            <div className="flex items-center gap-4 text-xs">
                                <Votes isPost={false} id={comment.id} />
                            </div>
                            
                            <div className="mt-3 max-w-[400px]">
                                <CommnetInput 
                                    postId={postId} 
                                    parentId={comment.id} 
                                    onCommentCreated={onCommentCreated} 
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {isExpanded && commentArray && commentArray.length > 0 && (
                <div className="border-l-2 border-gray-200 pl-2">
                    {commentArray.map((child)=>(
                        <OneComment 
                            key={child.id} 
                            postId={postId} 
                            comment={child} 
                            onCommentCreated={onCommentCreated}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}