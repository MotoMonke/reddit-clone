import { getPostAndComments } from "@/app/lib/db";
import PostCard from "@/app/ui/components/postScroll/postCard";
import { EnrichedComment,EnrichedPost,CommentNode } from "@/app/lib/types";
import CommentsTree from "@/app/ui/components/comments/commentsTree";
export default async function PostPage({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id;
  const result = await getPostAndComments(id);
  if(typeof result === 'string'){
     return <div>Post not found or error: {result}</div>;
  }
  const post: EnrichedPost = result.post;
  const comments: CommentNode[] = result.tree;
  const userId: number|null = result.userId
  return (
    <div className="ml-5 mr-5 ">
      <div className="flex flex-col items-center">
        <PostCard enrichedPost={post} userId={userId}/>
      </div>
      <CommentsTree enrichedComments={comments} postId={id} userId={userId}/>
    </div>
  );
}
