'use client'
import { useState,useEffect } from "react";
import { createComment } from "@/app/lib/db";
import { verifyToken } from "@/app/lib/jwt";
import { redirect } from "next/navigation";
import type { Comment } from "@/app/lib/types";
interface CommentInput{
    postId:number,
    parentId:number|null,
    onCommentCreated:(newComment:Comment)=>void
}
export default function CommnetInput({postId,parentId,onCommentCreated}:CommentInput){
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
            redirect('/login');
        }
    }
    return(
        <div >
            <input type="text" placeholder="Join the conversation" value={text} onChange={e=>setText(e.target.value)} onClick={handleInputClick} />
            <button onClick={submitComment}>Comment</button>
            {result.length>0&&<div>{result}</div>}
        </div>
    )    
}