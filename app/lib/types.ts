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
  created_at:string,
  title:string,
  text:string|null,
  image_url:string|null
}