import postgres from "postgres";
import { success } from "zod";
import bcrypt from 'bcrypt';
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