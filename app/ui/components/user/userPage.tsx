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
            const resultP = await getPosts(0,10,userId,0);
            const resultC = await getPosts(0,10,userId,1);
            const resultV = await getPosts(0,10,userId,2);
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
        <div>
            <div className="flex flex-row">
                <Image width={100} height={100} alt='profile image' src={imageUrl}/>
                <div>{username}</div>
            </div>
            <div className="flex flex-row">
                {option===0&&<div className="hover:cursor-pointer bg-blue-700">Posts</div>}
                {option!==0&&<div className="hover:cursor-pointer" onClick={()=>setOption(0)}>Posts</div>}
                {option===1&&<div className="hover:cursor-pointer bg-blue-700">Comments</div>}
                {option!==1&&<div className="hover:cursor-pointer" onClick={()=>setOption(1)}>Comments</div>}
                {option===2&&<div className="hover:cursor-pointer bg-blue-700">Voted</div>}
                {option!==2&&<div className="hover:cursor-pointer" onClick={()=>setOption(2)}>Voted</div>}
            </div>
            {option===0&&<PostList userId={userId} initialPostsArray={posts} type={0}/>}
            {option===1&&<PostList userId={userId} initialPostsArray={comments} type={1}/>}
            {option===2&&<PostList userId={userId} initialPostsArray={voted} type={2}/>}
        </div>
    )
}