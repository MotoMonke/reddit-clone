'use server'
import postgres from "postgres";
import bcrypt from 'bcryptjs';
import type { PostType } from "./types";
import type { Comment } from "./types"
import type { User } from "./types";
const sql = postgres({
    host: "localhost",
    user: "daniil",
    database: "reddit_clone",
    password: "332107",
    port: 5432
});


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
        return "internal server error";
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
        return result[0] as unknown as Comment;
    } catch (error) {
        console.log(error);
        return `error message: ${error}`;
    }
}