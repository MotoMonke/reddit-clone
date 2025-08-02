import { useState } from "react";
import type { Comment, CommentNode,User } from "@/app/lib/types";
import Votes from "../votes/votes";
import UserLink from "../user/userLink";
import CommnetInput from "./commentInput";
interface OneCommentProps{
    enrichedComment:CommentNode,
    postId:number,
    userId:number|null,
}
export default function OneComment({enrichedComment,postId,userId}:OneCommentProps){
    const [commentArray,setCommentArray] = useState<CommentNode[]>(enrichedComment.children||[]);
    const [isExpanded, setIsExpanded] = useState(true);
    
    interface functionInterface{
        comment:Comment,
        author:User,
    }
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
        setCommentArray(prev=>[...prev,commentNode]);
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
                        <UserLink userId={enrichedComment.comment.author_id} username={enrichedComment.authorUsername} profileImgUrl={enrichedComment.authorProfPicUrl}/>
                        <span>•</span>
                        <span>{new Date(enrichedComment.comment.created_at!).toLocaleString()}</span>
                    </div>
                    
                    {isExpanded && (
                        <>
                            <p className="mb-2">{enrichedComment.comment.body}</p>
                            
                            <div className="flex items-center gap-4 text-xs">
                                <Votes isPost={false} id={enrichedComment.comment.id} initialVote={enrichedComment.voted} likes={enrichedComment.upvotesAmount} dislikes={enrichedComment.downvotesAmount} userId={userId} />
                            </div>
                            
                            <div className="mt-3 max-w-[400px]">
                                <CommnetInput 
                                    postId={postId} 
                                    parentId={enrichedComment.comment.id} 
                                    onCommentCreated={onCommentCreated} 
                                    userId={userId}
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
                            key={child.comment.id} 
                            postId={postId} 
                            enrichedComment={child} 
                            userId={userId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}