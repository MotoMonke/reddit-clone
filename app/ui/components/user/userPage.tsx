'use client'
import { useState,useEffect } from "react"
import PostList from "../postScroll/postList"
import { getPosts } from "@/app/lib/db"
import { PostType } from "@/app/lib/types"
import { getUserById } from "@/app/lib/db"
import Image from "next/image"
interface UserPageInterface{
    userId:number
}
export default function UserPage({userId}:UserPageInterface){
    // i didn't thought about better way to toggle betwen user posts comments and voted posts
    const [option,setOption] = useState<0|1|2>(0);
    //
    const [posts,setPosts] = useState<PostType[]>([]);
    const [comments,setComments] = useState<PostType[]>([]);
    const [voted,setVoted] = useState<PostType[]>([]);
    const [loading,setLoading] = useState(true);
    //user photo and username
    const [imageUrl,setImageUrl] = useState('/default_profile.svg');
    const [username,setUsername] = useState('');
    useEffect(()=>{
        async function populateState(){
            setLoading(true);
            const resultP = await getPosts(0,userId,0);
            const resultC = await getPosts(0,userId,1);
            const resultV = await getPosts(0,userId,2);
            setPosts(resultP);
            setComments(resultC);
            setVoted(resultV);
            const user = await getUserById(userId);
            if(user!==null){
                setUsername(user.username);
                if(user.profile_img_url!==null){
                    setImageUrl(user.profile_img_url);
                }
            }
            setLoading(false)
        }
        populateState();
    },[]);
    if(loading){
        return <div>Loading...</div>
    }
    return(
        <div className="mt-5 flex flex-col gap-5">
            <div className="ml-10 flex gap-5 items-center">
                <Image className="rounded-xl" width={150} height={150} alt='profile image' src={imageUrl}/>
                <div className="text-3xl">{username}</div>
            </div>
            <div className="flex items-center gap-5 ml-10">
                {option===0&&<div className="hover:cursor-pointer hover:underline bg-gray-600 p-3 rounded-full">Posts</div>}
                {option!==0&&<div className="hover:cursor-pointer hover:underline" onClick={()=>setOption(0)}>Posts</div>}
                {option===1&&<div className="hover:cursor-pointer hover:underline bg-gray-600 p-3 rounded-full">Comments</div>}
                {option!==1&&<div className="hover:cursor-pointer hover:underline" onClick={()=>setOption(1)}>Comments</div>}
                {option===2&&<div className="hover:cursor-pointer hover:underline bg-gray-600 p-3 rounded-full">Voted</div>}
                {option!==2&&<div className="hover:cursor-pointer hover:underline" onClick={()=>setOption(2)}>Voted</div>}
            </div>
            {option===0&&<PostList initialPostsArray={posts} fetchFn={(offset)=>getPosts(offset,userId,0)}/>}
            {option===1&&<PostList initialPostsArray={comments} fetchFn={(offset)=>getPosts(offset,userId,1)}/>}
            {option===2&&<PostList initialPostsArray={voted} fetchFn={(offset)=>getPosts(offset,userId,2)}/>}
        </div>
    )
}