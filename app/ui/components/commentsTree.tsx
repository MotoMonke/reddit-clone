import type { Comment } from "@/app/lib/types";
interface CommentsTreeProps{
    comments:Comment[]
}
interface OneCommentProps{
    comment:Comment
}
export default function CommentsTree({comments}:CommentsTreeProps){
    return(
        <div>
            {comments.map((comment)=>(
                <OneComment key={comment.id} comment={comment}/>
            ))}
        </div>
    )
}
function OneComment({comment}:OneCommentProps){
    return(
        <div className="ml-10">
            <p>{comment.body}</p>
            {comment.children && comment.children.length>0 && (
                <div>
                    {comment.children.map((child)=>(
                        <OneComment key={child.id} comment={child}/>
                    ))}
                </div>
            )}
        </div>
    )
}