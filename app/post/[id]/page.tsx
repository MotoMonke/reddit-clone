import { getPostAndComments } from "@/app/lib/db";
import PostCard from "@/app/ui/components/postScroll/postCard";
import { PostType } from "@/app/lib/types";
import { Comment } from "@/app/lib/types";
import CommentsTree from "@/app/ui/components/comments/commentsTree";
export default async function PostPage({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id;
  const result = await getPostAndComments(id);
  if(typeof result === 'string'){
     return <div>Post not found or error: {result}</div>;
  }
  const post: PostType = result.post;
  const comments: Comment[] = result.tree;
  return (
    <div className="ml-5 mr-5 ">
      <div className="flex flex-col items-center">
        <PostCard post={post} />
      </div>
      <CommentsTree comments={comments} postId={id}/>
    </div>
  );
}
