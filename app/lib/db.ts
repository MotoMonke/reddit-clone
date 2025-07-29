'use server'
import postgres from "postgres";
import bcrypt from 'bcryptjs';
import type { PostType } from "./types";
import type { Comment } from "./types"
import type { User } from "./types";
import type { Notification } from "./types";
const connectionString = process.env.PSQL
if(!connectionString){
    throw new Error('no connection string provided')
}
const sql = postgres(connectionString);
//for verifyToken
export async function getUserById(id:number){
    const user:User[] = await sql`
        SELECT * FROM users WHERE id = ${id};
    `
    if(user.length===0){
        return null;
    }else{
        return user[0];
    }
}
//for login
export async function getUserByEmail(email:string,password:string){
    const data:User[] = await sql`
        SELECT * FROM users WHERE email = ${email}
    `
    if(data.length===0){
        return null;
    }
    const user:User = data[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return null;
    }
    return user;
}
//for signup
export async function createUser(email:string,username:string,password:string){
    const existingEmail:User[] = await sql`
        SELECT * FROM users WHERE email = ${email}
    ` 
    if(existingEmail.length!==0){
        return "this email is taken";
    }
    const existingUsername:User[] = await sql`
        SELECT * FROM users WHERE username = ${username}
    ` 
    if(existingUsername.length!==0){
        return "this username is taken";
    }
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await sql`
        INSERT INTO users (email,username,password)
        VALUES (${email},${username},${hashedPassword});
        `
        return "succes";
    } catch (error) {
        console.log(error);
        return `error message ${error}`;
    }
}
//posts

export async function insertPost(author_id:number,title:string,text:string|null,imageUrl:string|null){
    try {
            await sql`
            INSERT INTO posts (author_id,title,text,image_url)
            VALUES (${author_id},${title},${text},${imageUrl})
            `
        return 'succes';
    } catch (error) {
        return `error message: ${error}`
    }
}
/*
export async function getPosts(offset:number,limit:number){
    try {
        const postArray = await sql`
        SELECT * FROM posts LIMIT ${limit} OFFSET ${offset}
        `
        console.log(postArray)
        return postArray as unknown as PostType[];
    } catch (error) {
        console.log(error);
        return [];
    }
}
*/

function buildTree(flatList:Comment[]){
    const idMap:any = {};
    const tree:any = [];
    flatList.forEach(comment => {
        idMap[comment.id] = {...comment,children: []}
    });
    flatList.forEach(comment=>{
        if(comment.parent_id === null) {
            tree.push(idMap[comment.id]);
        } else {
            const parent = idMap[comment.parent_id];
            if (parent) {
                parent.children.push(idMap[comment.id]);
            }
        }
    })
    return tree;
}

export async function getPostAndComments(postId:number){
    try {
        const result = await sql`
        SELECT * FROM posts WHERE id=${postId}
        `
        const post = result[0] as PostType;
        const comments:Comment[] = await sql`
        SELECT * FROM comments WHERE post_id=${postId}
        `
        if(comments.length>0){
            const tree = buildTree(comments);
            return ({post:post,tree:tree})
        }
        return {post:post,tree:[]};
    } catch (error) {
        console.log(error)
        return `error message: ${error}`;
    }
}
export async function createComment(authorId:number,postId:number,parentId:number|null,body:string){
    try {
        const result = await sql`
        INSERT INTO comments (author_id,post_id,parent_id,body) 
        VALUES (${authorId},${postId},${parentId},${body})
        RETURNING *
        `
        await createNotification(postId,authorId,parentId);
        return result[0] as unknown as Comment;
    } catch (error) {
        console.log(error);
        return `error message: ${error}`;
    }
}
export async function getAmountOfComments(postId:number){
    try {
        const result = await sql`
        SELECT COUNT(*) FROM comments
        WHERE post_id = ${postId}
        `
        const count = Number(result[0].count??0);
        return count;
    } catch (error) {
        console.log(error);
    }
}
//votes(like/dislike for posts and comments)
//posts
export async function votePost(vote:boolean,userId:number,postId:number){
    try {
        const existing = await sql`
        SELECT vote FROM post_votes
        WHERE user_id = ${userId} AND post_id = ${postId}
        `
        if(existing.length===0){
            await sql`
            INSERT INTO post_votes (user_id,post_id,vote)
            VALUES (${userId},${postId},${vote})
            `
        }else if(existing[0].vote===vote){
            await sql`
            DELETE FROM post_votes
            WHERE user_id = ${userId} AND post_id = ${postId}
            `
        }else{
            await sql`
            UPDATE post_votes
            SET vote = ${vote}
            WHERE user_id = ${userId} AND post_id = ${postId}
            `
        }
    } catch (error) {
        console.log(error);
    }
}
export async function getPostVotesAmount(postId:number){
    try {
        const result1 = await sql`
        SELECT COUNT(*) FROM post_votes
        WHERE post_id = ${postId} AND vote = true
        `
        const result2 = await sql`
        SELECT COUNT(*) FROM post_votes
        WHERE post_id = ${postId} AND vote = false
        `
        const upVotes = Number(result1[0].count??0);
        const downVotes = Number(result2[0].count??0);
        return {upVotes,downVotes};
    } catch (error) {
        console.log(error);
    }
}
export async function checkPostVote(postId:number,userId:number){
    //returns true false or null
    //true means upvote, false means downvote, null means no vote
    try {
        const result = await sql`
        SELECT * FROM post_votes
        WHERE post_id=${postId} AND user_id=${userId}
        `
        if(result.length===0){
            return null;
        }else{
            return result[0].vote;
        }
    } catch (error) {
        console.log(error);
    }
}
//coments
export async function voteComment(vote:boolean,userId:number,commentId:number){
    try {
        const existing = await sql`
        SELECT vote FROM comment_votes
        WHERE user_id = ${userId} AND comment_id = ${commentId}
        `
        if(existing.length===0){
            await sql`
            INSERT INTO comment_votes (user_id,comment_id,vote)
            VALUES (${userId},${commentId},${vote})
            `
        }else if(existing[0].vote===vote){
            await sql`
            DELETE FROM comment_votes
            WHERE user_id = ${userId} AND comment_id = ${commentId}
            `
        }else{
            await sql`
            UPDATE comment_votes
            SET vote = ${vote}
            WHERE user_id = ${userId} AND comment_id = ${commentId}
            `
        }
    } catch (error) {
        console.log(error);
    }
}
export async function getCommentVotesAmount(commentId:number){
    try {
        const result1 = await sql`
        SELECT COUNT(*) FROM comment_votes
        WHERE comment_id = ${commentId} AND vote = true
        `
        const result2 = await sql`
        SELECT COUNT(*) FROM comment_votes
        WHERE comment_id = ${commentId} AND vote = false
        `
        const upVotes = Number(result1[0].count??0);
        const downVotes = Number(result2[0].count??0);
        return {upVotes,downVotes};
    } catch (error) {
        console.log(error);
    }
}
export async function checkCommentVote(commentId:number,userId:number){
    //return true false or null
    //true means upvote, false means downvote, null means no vote
    try {
        const result = await sql`
        SELECT * FROM comment_votes
        WHERE comment_id=${commentId} AND user_id=${userId}
        `
        if(result.length===0){
            return null;
        }else{
            return result[0].vote;
        }
    } catch (error) {
        console.log(error);
    }
}
//refactored get posts
export async function getPosts(offset:number,userId:number|null,type:0|1|2|null): Promise<PostType[]>{
    //type values:
    //0 -- get posts that are created by user
    //1 -- get posts that are commented by user
    //2 -- get posts that are voted by user
    if(userId===null&&type===null){
        try {
            const postArray = await sql`
            SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET ${offset}
            `
            return postArray as unknown as PostType[];
        } catch (error) {
            console.log(error);
            return [];
        }
    }else if(type===0){
        try {
            const postArray = await sql`
            SELECT * FROM posts 
            WHERE author_id = ${userId!}
            ORDER BY created_at DESC
            LIMIT 10 OFFSET ${offset} 
            `
            return postArray as unknown as PostType[];
        } catch (error) {
            console.log(error);
            return [];
        }
    }else if(type===1){
        try {
            const comentedPostsIds = await sql`
            SELECT DISTINCT post_id FROM comments WHERE author_id = ${userId!}
            `
            const ids =comentedPostsIds.map(row=>row.post_id);
            if(ids.length===0){
                return [];
            }
            const postArray = await sql`
            SELECT * FROM posts
            WHERE id = ANY(${ids})
            ORDER BY created_at DESC
            LIMIT 10 OFFSET ${offset}
            `
            return postArray as unknown as PostType[];
        } catch (error) {
            console.log(error);
            return [];
        }
    }else if(type===2){
        try {
            const votedPostsIds = await sql`
            SELECT DISTINCT post_id FROM post_votes WHERE user_id = ${userId!}
            `
            const ids = votedPostsIds.map(row=>row.post_id);
            if(ids.length===0){
                return [];
            }
            const postArray = await sql`
            SELECT * FROM posts
            WHERE id = ANY(${ids})
            ORDER BY created_at DESC
            LIMIT 10 OFFSET ${offset}
            `
            return postArray as unknown as PostType[];
        } catch (error) {
            console.log(error);
            return [];
        }
    }else{
        return [];
    }
}
//i wrote this function to pass it as prop to postList.tsx in postScroll.tsx
//because postScroll is server component and i can't define functions inside of it
//why define separete function? 'cause postList accepts fetchFn(offset) func that returns PostType[]
//but getPosts is(offset,userId,type), i think you get it 
//this function is just getPosts with(offset,null,null) arguments
export async function getPostsForGlobalFeed(offset:number){
    const result:PostType[] = await getPosts(offset,null,null);
    return result;
}
//searching posts
export async function searchPosts(offset:number,query:string){
    try {
        const keyword = `%${query}%`;
        const postArray:PostType[] = await sql`
        SELECT * FROM posts
        WHERE title ILIKE ${keyword} OR text ILIKE ${keyword}
        ORDER BY created_at DESC
        LIMIT 10 OFFSET ${offset}
        `
        return postArray;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function editUser(userId:number,username:string,email:string,profileImgUrl:null|string){
    try {
        if(profileImgUrl===null){
            await sql `
            UPDATE users
            SET username = ${username}, email = ${email}
            WHERE id = ${userId}
            `
        }else{
            await sql `
            UPDATE users
            SET username = ${username}, email = ${email}, profile_img_url = ${profileImgUrl}
            WHERE id = ${userId}
            `
        }
        return 'success!';
    } catch (error) {
        console.log(error);
        return `Error message: ${error}`
    }
}
//creating notifications, they are going to be created when someone comments under user post(first tree level comment) or someone answers to user comment
async function createNotification(post_id:number,author_id:number,comment_id:number|null) {
    //comment_id stands for id of coment that users replies to, if it's null notification will be sent to post author, else to comment author
    try {
        const answer = await sql`
        SELECT author_id FROM posts WHERE id = ${post_id}
        `
        const post_author_id = answer[0].author_id as number;
        if(comment_id===null){
            if(post_author_id===author_id){
                return;
            }
            await sql`
                INSERT INTO notifications (post_id,author_id,receiver_id)
                VALUES (${post_id},${author_id},${post_author_id})
            `
        }else{
            //it seems like this function don't need comment id, but:
            //if comment is an answer to another comment then using comment id function will find
            //author of comment id and set receiver id to it
            const answer = await sql`
            SELECT * FROM comments WHERE id = ${comment_id}
            `
            if(answer.length===0){
                throw new Error('comment not found');
            }
            const comment = answer[0] as Comment;
            if(comment.author_id===author_id){
                return;
            }
            await sql `
                INSERT INTO notifications (post_id,author_id,receiver_id,comment_id)
                VALUES (${post_id},${author_id},${comment.author_id},${comment_id})
            `
        }
    } catch (error) {
        console.log(error);
    }
}
export async function getNotifications(userId:number){
    try {
        const notifications:Notification[] = await sql`
        SELECT * FROM notifications WHERE receiver_id = ${userId}
        `
        if(notifications.length>0){
            return notifications;
        }else{
            return [];
        }
    } catch (error) {
        console.log(error);
        return `error message: ${error}`
    }
}
export async function getNotificationsCount(userId:number){
    try {
        const result = await sql`
        SELECT COUNT(*) FROM notifications
        WHERE receiver_id = ${userId} AND is_read = false
        `
        const count = Number(result[0].count??0);
        return count;
    } catch (error) {
        console.log(error);
        return null;
    }
}
export async function markNotificationsAsRead(userId:number){
    try {
        await sql`
        UPDATE notifications
        SET is_read = true
        WHERE receiver_id = ${userId} AND is_read = false
        `
    } catch (error) {
        console.log(error);
    }
}
export async function deleteNotifications(userId:number){
    try {
        await sql`
        DELETE FROM notifications WHERE receiver_id = ${userId}
        `
    } catch (error) {
        console.log(error);
    }
}
