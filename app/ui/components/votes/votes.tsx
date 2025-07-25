'use lient';
import { useState,useEffect } from 'react';
import { getPostVotesAmount,checkPostVote,votePost,voteComment,getCommentVotesAmount,checkCommentVote } from '@/app/lib/db';
import { verifyToken } from '@/app/lib/jwt';
import { redirect } from 'next/navigation';
import Image from 'next/image';
interface VotesInterface {
  id: number;
  isPost: boolean;
}

export default function Votes({ id,isPost }:VotesInterface) {
    const [likesAmount,setLikesAmount] = useState(0);
    const [dislikesAmount,setDislikesAmount] = useState(0);
    const [userId,setUserId] = useState<null|number>(null);
    //true means upvote, false means downvote, null means no vote
    const [voted,setVoted] = useState<null|true|false>(null);
    const functions = isPost?{getAmount:getPostVotesAmount,checkVote:checkPostVote,vote:votePost}:{getAmount:getCommentVotesAmount,checkVote:checkCommentVote,vote:voteComment};
    useEffect(()=>{
        async function getVotes(){
            const { upVotes, downVotes } = await functions.getAmount(id);
            setLikesAmount(upVotes);
            setDislikesAmount(downVotes);
        }
        async function checkUser(){
            //returns userId or null if not logged in
            const answer = await verifyToken();
            if(answer!==null){
                setUserId(answer);
            }
        }
        getVotes();
        checkUser();
    },[]);
    useEffect(()=>{
        if(userId!==null){
            async function checkIfVoted(){
                //returns null true or false
                const result = await functions.checkVote(id,userId!);
                setVoted(result);
            }
            checkIfVoted();
        }
    },[userId])
    async function vote(value:boolean){
        if(userId!==null){
            if(voted===null){
                setVoted(value);
                if(value){
                    setLikesAmount(prev=>prev+1);
                }else{
                    setDislikesAmount(prev=>prev+1);
                }
            }else if(voted){
                if(value){
                    setVoted(null);
                    setLikesAmount(prev=>prev-1);
                }else{
                    setVoted(false);
                    setLikesAmount(prev=>prev-1);
                    setDislikesAmount(prev=>prev+1);
                }
            }else{
                if(value){
                    setVoted(true);
                    setLikesAmount(prev=>prev+1);
                    setDislikesAmount(prev=>prev-1);
                }else{
                    setVoted(null);
                    setDislikesAmount(prev=>prev-1);
                }
            }
            await functions.vote(value,userId,id);
        }else{
            redirect('/login');
        }

    }
  return (
    <div>
        <div>
            {(voted===null||voted===false)&&<Image src="/like.svg" width={10} height={10} alt="like icon" className='hover:cursor-pointer' onClick={()=>vote(true)}/>}
            {(voted===true)&&<div><Image src="/like.svg" width={10} height={10} alt="like icon" className='hover:cursor-pointer' onClick={()=>vote(true)}/>*</div>}
            <div>{likesAmount}</div>
        </div>
        <div>
            {(voted===null||voted===true)&&<Image src="/dislike.svg" width={10} height={10} alt="dislike icon" className='hover:cursor-pointer' onClick={()=>vote(false)}/>}
            {(voted===false)&&<div><Image src="/dislike.svg" width={10} height={10} alt="dislike icon" className='hover:cursor-pointer' onClick={()=>vote(false)}/>*</div>}
            <div>{dislikesAmount}</div>
        </div>
    </div>
  );
}
