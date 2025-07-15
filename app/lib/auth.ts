'use server';
import { success, z} from 'zod';
import { signToken } from './jwt';
import { getUserByEmail,createUser } from './db';
import { cookies } from 'next/headers';
import { create } from 'domain';
import { CLIENT_STATIC_FILES_RUNTIME_WEBPACK } from 'next/dist/shared/lib/constants';
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
} 
export async function signup(prevState:FormState,formData:FormData):Promise<FormState>{
    const rawEmail = formData.get('email');
    const rawUsername = formData.get('username');
    const rawPassword = formData.get('password');
    if (typeof rawEmail !== 'string' || typeof rawPassword !== 'string' || typeof rawUsername !=='string' ||rawPassword.length<6) {
        return { error: 'Invalid form data' };
    }
    const { email,username ,password } = FormSchema.parse({ email: rawEmail,username:rawUsername ,password: rawPassword });
    const response = await createUser(email,username,password);
    if(response!=="succes"){
        return {error:response};
    }
    return {success:true};
}
