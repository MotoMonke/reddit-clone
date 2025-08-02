'use client'
import { useState,useEffect } from "react";
import { createComment } from "@/app/lib/db";
import { verifyToken } from "@/app/lib/jwt";
import { useRouter } from "next/navigation";
import type { Comment } from "@/app/lib/types";
interface CommentInput{
    postId:number,
    parentId:number|null,
    onCommentCreated:(newComment:Comment)=>void,
    userId:number|null
}
export default function CommnetInput({postId,parentId,onCommentCreated,userId}:CommentInput){
    const router = useRouter();
    const [result,setResult] = useState('');
    const [text,setText] = useState('');;
    async function submitComment(){
        if(userId===null){
            router.push('/login');
        }
        if(text.length===0){
            setResult('Enter some text please');
            return;
        }
        const answer = await createComment(userId!,postId,parentId,text);
        if(typeof answer!=='string'){
            setResult('the commnet was succesfuly created!');
            setText('');
            onCommentCreated(answer);
        }else{
            setResult(`something went wrong ${answer}`);
        }
    }
    function handleInputClick(){
        if(userId===null){
            router.push('/login');
        }
    }
    return(
        <div className="mb-4">
            <div className="">
                <textarea
                    className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What are your thoughts?"
                    value={text}
                    onChange={e=>setText(e.target.value)}
                    onClick={handleInputClick}
                    rows={3}
                />
            </div>
            
            <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                    {result}
                </div>
                
                <button 
                    onClick={submitComment}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium disabled:opacity-50"
                    disabled={userId===null || text.length === 0}
                >
                    Comment
                </button>
            </div>
        </div>
    )    
}