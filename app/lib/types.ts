export type PasswordProps = {
  changeState: () => void;
  changePassword: (value: string) => void;
  password: string;
};
export type PostType = {
  id:number,
  author_id:number,
  created_at:Date,
  title:string,
  text:string|null,
  image_url:string|null
}
export type EnrichedPost = {
  post:PostType,
  upvotesAmount:number,
  downvotesAmount:number,
  voted:null|boolean,
  commentsAmount:number,
}
export type Comment = {
  id:number,
  author_id:number,
  post_id:number,
  parent_id:number|null,
  body:string,
  created_at?:Date,
}
export type EnrichedComment = {
  comment:Comment,
  upvotesAmount:number,
  downvotesAmount:number,
  voted:null|boolean,
}
export type User = {
    id:number,
    email:string,
    password:string,
    username:string,
    profile_img_url:string|null,
}
export type Notification = {
  id:number,
  post_id:number,
  author_id:number,
  receiver_id:number,
  comment_id:number|null,
  is_read:boolean,
  created_at:Date
}
export type PostVote = {
  id:number,
  post_id:number,
  user_id:number,
  vote:boolean
}
export type CommentVote = {
  id:number,
  comment_id:number,
  user_id:number,
  vote:boolean
}
export type CommentNode = EnrichedComment & {
  children: CommentNode[];
};