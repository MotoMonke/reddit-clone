export type Payload={
    userId:number,
    userEmail:string,
    username:string,
    exp:number,
}
export type PasswordProps = {
  changeState: () => void;
  changePassword: (value: string) => void;
  password: string;
};
export type PostType ={
  id:number,
  author_id:number,
  created_at:Date,
  title:string,
  text:string|null,
  image_url:string|null
}
export type Comment = {
  id:number,
  author_id:number,
  post_id:number,
  parent_id:number|null,
  body:string,
  created_at?:Date,
  children?:Comment[],
}
export type User = {
    id:number,
    email:string,
    password:string,
    username:string,
    profile_img_url:string|null,
}