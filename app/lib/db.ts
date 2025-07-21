'use server'
import postgres from "postgres";
import bcrypt from 'bcryptjs';
const sql = postgres({
    host: "localhost",
    user: "daniil",
    database: "reddit_clone",
    password: "332107",
    port: 5432
});

type User = {
    id:number,
    email:string,
    password:string,
    username:string,
}
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
        const newPost = await sql`
        INSERT INTO posts (author_id,title,text,image_url)
        VALUES (${author_id},${title},${text},${imageUrl})
        `
        return 'succes';
    } catch (error) {
        return `error message: ${error}`
    }
}