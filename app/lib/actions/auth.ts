'use server';
import { z } from 'zod';
import { signToken } from '../jwt';
import { getUserByEmail,createUser } from '../db';
import { cookies } from 'next/headers';
const FormSchema = z.object({
    email:z.email(),
    username:z.string(),
    password:z.string(),
})
const LoginSchema = FormSchema.omit({username:true});
type FormState = { error?: string; success?: boolean };
export async function login(prevState:FormState,formData:FormData):Promise<FormState>{
    const rawEmail = formData.get('email');
    const rawPassword = formData.get('password');
    try {
        if (typeof rawEmail !== 'string' || typeof rawPassword !== 'string') {
            return { error: 'Invalid form data' };
        }
        const { email, password } = LoginSchema.parse({ email: rawEmail, password: rawPassword });
        const user = await getUserByEmail(email,password);
        if(user===null){
            return {error:"invalid credentials"};
        }
        const userId = user.id;
        const userEmail = user.email;
        const username = user.username;
        const token = await signToken({userId,userEmail,username});
        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day in seconds
        });
        return {success:true};
    } catch (err) {
        if (err instanceof z.ZodError) {
            return { error: err.message };
        }
        return {error:`${err}`}
    }
} 
//logins user without email and password aka guest mode
export async function lazyLogin(prevState:FormState,formData:FormData):Promise<FormState>{
    try {
        const userId = 2;
        const userEmail = 'guest@email.com';
        const username = 'guest';
        //i don't thinl that i need to check credentials here...
        //const user = await getUserByEmail(email,password);
        //if(user===null){
        //    return {error:"invalid credentials"};
        //}
        const token = await signToken({userId,userEmail,username});
        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day in seconds
        });
        return {success:true};
    } catch (err) {
        return {error:`${err}`}
    }
}
export async function signup(prevState:FormState,formData:FormData):Promise<FormState>{
    const rawEmail = formData.get('email');
    const rawUsername = formData.get('username');
    const rawPassword = formData.get('password');
    try {
        if (typeof rawEmail !== 'string' || typeof rawPassword !== 'string' || typeof rawUsername !=='string' ||rawPassword.length<6) {
            return { error: 'Invalid form data' };
        }
        const { email,username ,password } = FormSchema.parse({ email: rawEmail,username:rawUsername ,password: rawPassword });
        const response = await createUser(email,username,password);
        if(response!=="succes"){
            return {error:response};
        }
        return {success:true};
    } catch (err) {
        if (err instanceof z.ZodError) {
            return { error: err.message };
        }
        return {error:`${err}`}
    }
}
export async function logout(){
    try {
        const cookieStore = await cookies();
        cookieStore.delete('token');
    } catch (error) {
        console.log(error);
    }
}
