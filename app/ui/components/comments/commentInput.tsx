'use client'
import { useState,useEffect } from "react";
import { createComment } from "@/app/lib/db";
import { verifyToken } from "@/app/lib/jwt";
import { useRouter } from "next/navigation";
import type { Comment } from "@/app/lib/types";
interface CommentInput{
    postId:number,
    parentId:number|null,
    onCommentCreated:(newComment:Comment)=>void
}
export default function CommnetInput({postId,parentId,onCommentCreated}:CommentInput){
    const router = useRouter();
    const [result,setResult] = useState('');
    const [text,setText] = useState('');
    const [isVerified,setIsVerified] = useState(false);
    const [userId,setUserId] = useState<null|number>(null);
    useEffect(()=>{
        async function checkUser(){
            //returns userId or null if not logged in
            const answer = await verifyToken();
            if(answer!==null){
                setIsVerified(true);
                setUserId(answer);
            }
        }
        checkUser();
    },[]);
    async function submitComment(){
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
        if(!isVerified){
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
                    disabled={!isVerified || text.length === 0}
                >
                    Comment
                </button>
            </div>
        </div>
    )    
}