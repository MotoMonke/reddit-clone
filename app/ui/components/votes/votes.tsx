'use lient';
import { useState } from 'react';
import { votePost,voteComment} from '@/app/lib/db';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
interface VotesInterface {
  id: number,
  isPost: boolean,
  initialVote: boolean|null,
  likes:number,
  dislikes:number,
  userId:number|null
}

export default function Votes({ id,isPost,initialVote,likes,dislikes,userId }:VotesInterface) {
    const router = useRouter();
    const functions = isPost?{serverVote:votePost}:{serverVote:voteComment};
    const [likesAmount,setLikesAmount] = useState(likes);
    const [dislikesAmount,setDislikesAmount] = useState(dislikes);
    //true means upvote, false means downvote, null means no vote
    const [voted,setVoted] = useState<null|true|false>(initialVote);
    async function vote(value:boolean){
        if(userId===null){
            router.push('/login');
        }
        await functions.serverVote(value,id,userId!);
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
