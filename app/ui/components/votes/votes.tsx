'use lient';
import { useState,useEffect } from 'react';
import { getPostVotesAmount,checkPostVote,votePost,voteComment,getCommentVotesAmount,checkCommentVote } from '@/app/lib/db';
import { verifyToken } from '@/app/lib/jwt';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
interface VotesInterface {
  id: number;
  isPost: boolean;
}

export default function Votes({ id,isPost }:VotesInterface) {
    const router = useRouter();
    const [likesAmount,setLikesAmount] = useState(0);
    const [dislikesAmount,setDislikesAmount] = useState(0);
    const [userId,setUserId] = useState<null|number>(null);
    //true means upvote, false means downvote, null means no vote
    const [voted,setVoted] = useState<null|true|false>(null);
    const functions = isPost?{getAmount:getPostVotesAmount,checkVote:checkPostVote,vote:votePost}:{getAmount:getCommentVotesAmount,checkVote:checkCommentVote,vote:voteComment};
    useEffect(()=>{
        async function getVotes(){
            const result = await functions.getAmount(id);
            if(result===undefined){
                setLikesAmount(0);
                setDislikesAmount(0);  
            }else{
                setLikesAmount(result.upVotes);
                setDislikesAmount(result.downVotes);
            }
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
    },[functions,id]);
    useEffect(()=>{
        if(userId!==null){
            async function checkIfVoted(){
                //returns null true or false
                const result = await functions.checkVote(id,userId!);
                setVoted(result);
            }
            checkIfVoted();
        }
    },[userId,functions,id])
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
            router.push('/login');
        }

    }
  return (
    <div className='flex flex-row bg-[#2A3236] pt-1 pb-1 rounded-full justify-center gap-2 min-w-25'>
        <div className="flex flex-row gap-1.5 ml-3">
            {(voted===null||voted===false)&&<Image src="/like.svg" width={20} height={20} alt="like icon" className='hover:cursor-pointer' onClick={()=>vote(true)}/>}
            {(voted===true)&&<Image src="/like-active.svg" width={15} height={15} alt="like icon" className='hover:cursor-pointer' onClick={()=>vote(true)}/>}
            <div>{likesAmount}</div>
        </div>
        <div className='bg-white w-0.5 h-full'></div>
        <div className="flex flex-row gap-1.5 mr-3">
            {(voted===null||voted===true)&&<Image src="/dislike.svg" width={20} height={20} alt="dislike icon" className='hover:cursor-pointer' onClick={()=>vote(false)}/>}
            {(voted===false)&&<Image src="/dislike-active.svg" width={15} height={15} alt="dislike icon" className='hover:cursor-pointer' onClick={()=>vote(false)}/>}
            <div>{dislikesAmount}</div>
        </div>
    </div>
  );
}
