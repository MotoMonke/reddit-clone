'use server'
import postgres from "postgres";
import bcrypt from 'bcryptjs';
import type { User,Notification,PostType,EnrichedPost,Comment,EnrichedComment,CommentNode, ShortUser, EnrichedNotification } from "./types"
import { verifyToken } from "./jwt";
const connectionString = process.env.PSQL
if(!connectionString){
    throw new Error('no connection string provided')
}
const sql = postgres(connectionString);
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
        await sql`
        INSERT INTO users (email,username,password)
        VALUES (${email},${username},${hashedPassword});
        `
        return "succes";
    } catch (error) {
        console.log(error);
        return `error message ${error}`;
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
export async function getPostsForGlobalFeed(offset: number): Promise<EnrichedPost[]> {
  try {
    const userId = await verifyToken();

    // 1. Get posts (paginated)
    const rawPosts: PostType[] = await sql`
      SELECT * FROM posts 
      ORDER BY created_at DESC 
      LIMIT 10 OFFSET ${offset}
    `;

    if (rawPosts.length === 0) return [];

    const postIds = rawPosts.map(p => p.id);

    // 2. Get comments count per post
    const commentsCountsResult = await sql`
      SELECT post_id, COUNT(*) AS count FROM comments
      WHERE post_id = ANY(${postIds})
      GROUP BY post_id
    `;
    const commentCountsMap = new Map<number, number>();
    commentsCountsResult.forEach(row => {
      commentCountsMap.set(row.post_id, Number(row.count));
    });

    // 3. Get vote counts (upvotes and downvotes)
    const votesResult = await sql`
      SELECT post_id, vote, COUNT(*) as count
      FROM post_votes
      WHERE post_id = ANY(${postIds})
      GROUP BY post_id, vote
    `;
    const votesMap = new Map<number, { upvotes: number; downvotes: number }>();
    rawPosts.forEach(post => {
      votesMap.set(post.id, { upvotes: 0, downvotes: 0 });
    });
    votesResult.forEach(row => {
      const voteInfo = votesMap.get(row.post_id)!;
      if (row.vote) {
        voteInfo.upvotes = Number(row.count);
      } else {
        voteInfo.downvotes = Number(row.count);
      }
    });

    // 4. Get user vote for each post (if logged in)
    const userVotesMap = new Map<number, boolean>();
    if (userId !== null) {
      const userVotes = await sql`
        SELECT post_id, vote FROM post_votes
        WHERE user_id = ${userId} AND post_id = ANY(${postIds})
      `;
      userVotes.forEach(row => {
        userVotesMap.set(row.post_id, row.vote);
      });
    }
    //geting post authors
    const postAuthorsMap = new Map<number,ShortUser>();
    const postAuthors = await sql`
        SELECT DISTINCT users.id, users.username, users.profile_img_url
        FROM users
        JOIN posts ON posts.author_id = users.id
        WHERE posts.id = ANY(${postIds})

    `
    postAuthors.forEach(row =>{
        postAuthorsMap.set(row.id,(row as ShortUser));
    });
    // 5. Combine everything into EnrichedPost[]
    const enrichedPosts: EnrichedPost[] = rawPosts.map(post => ({
      post,
      commentsAmount: commentCountsMap.get(post.id) ?? 0,
      upvotesAmount: votesMap.get(post.id)?.upvotes ?? 0,
      downvotesAmount: votesMap.get(post.id)?.downvotes ?? 0,
      voted: userVotesMap.get(post.id) ?? null,
      authorUsername:postAuthorsMap.get(post.author_id)?.username??null,
      authorProfPicUrl:postAuthorsMap.get(post.author_id)?.profile_img_url??null,
    }));

    return enrichedPosts;

  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserPosts(offset:number,authorId:number): Promise<EnrichedPost[]>{
    try {
    const userId = await verifyToken();
    // 1. Get posts (paginated)
    const rawPosts: PostType[] = await sql`
      SELECT * FROM posts 
      WHERE author_id = ${authorId}
      ORDER BY created_at DESC 
      LIMIT 10 OFFSET ${offset}
    `;

    if (rawPosts.length === 0) return [];

    const postIds = rawPosts.map(p => p.id);

    // 2. Get comments count per post
    const commentsCountsResult = await sql`
      SELECT post_id, COUNT(*) AS count FROM comments
      WHERE post_id = ANY(${postIds})
      GROUP BY post_id
    `;
    const commentCountsMap = new Map<number, number>();
    commentsCountsResult.forEach(row => {
      commentCountsMap.set(row.post_id, Number(row.count));
    });

    // 3. Get vote counts (upvotes and downvotes)
    const votesResult = await sql`
      SELECT post_id, vote, COUNT(*) as count
      FROM post_votes
      WHERE post_id = ANY(${postIds})
      GROUP BY post_id, vote
    `;
    const votesMap = new Map<number, { upvotes: number; downvotes: number }>();
    rawPosts.forEach(post => {
      votesMap.set(post.id, { upvotes: 0, downvotes: 0 });
    });
    votesResult.forEach(row => {
      const voteInfo = votesMap.get(row.post_id)!;
      if (row.vote) {
        voteInfo.upvotes = Number(row.count);
      } else {
        voteInfo.downvotes = Number(row.count);
      }
    });

    // 4. Get user vote for each post (if logged in)
    const userVotesMap = new Map<number, boolean>();
    if (userId !== null) {
      const userVotes = await sql`
        SELECT post_id, vote FROM post_votes
        WHERE user_id = ${userId} AND post_id = ANY(${postIds})
      `;
      userVotes.forEach(row => {
        userVotesMap.set(row.post_id, row.vote);
      });
    }
    //geting post authors
    const postAuthorsMap = new Map<number,ShortUser>();
    const postAuthors = await sql`
        SELECT DISTINCT users.id, users.username, users.profile_img_url
        FROM users
        JOIN posts ON posts.author_id = users.id
        WHERE posts.id = ANY(${postIds})

    `
    postAuthors.forEach(row =>{
        postAuthorsMap.set(row.id,(row as ShortUser));
    });
    // 5. Combine everything into EnrichedPost[]
    const enrichedPosts: EnrichedPost[] = rawPosts.map(post => ({
      post,
      commentsAmount: commentCountsMap.get(post.id) ?? 0,
      upvotesAmount: votesMap.get(post.id)?.upvotes ?? 0,
      downvotesAmount: votesMap.get(post.id)?.downvotes ?? 0,
      voted: userVotesMap.get(post.id) ?? null,
      authorUsername:postAuthorsMap.get(post.author_id)?.username??null,
      authorProfPicUrl:postAuthorsMap.get(post.author_id)?.profile_img_url??null,
    }));

    return enrichedPosts;

  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getCommentedPosts(offset:number,comentAuthorId:number): Promise<EnrichedPost[]>{
    try {
        const userId = await verifyToken();
        const rawPosts:PostType[] = await sql`
        SELECT * FROM posts
        WHERE id IN (
        SELECT DISTINCT post_id FROM comments WHERE author_id = ${comentAuthorId}
        )
        ORDER BY created_at DESC
        LIMIT 10 OFFSET ${offset}
        `
        if (rawPosts.length === 0) return [];
        const postIds = rawPosts.map(post => post.id);
        // 2. Get comments count per post
        const commentsCountsResult = await sql`
        SELECT post_id, COUNT(*) AS count FROM comments
        WHERE post_id = ANY(${postIds})
        GROUP BY post_id
        `;
        const commentCountsMap = new Map<number, number>();
        commentsCountsResult.forEach(row => {
        commentCountsMap.set(row.post_id, Number(row.count));
        });

        // 3. Get vote counts (upvotes and downvotes)
        const votesResult = await sql`
        SELECT post_id, vote, COUNT(*) as count
        FROM post_votes
        WHERE post_id = ANY(${postIds})
        GROUP BY post_id, vote
        `;
        const votesMap = new Map<number, { upvotes: number; downvotes: number }>();
        rawPosts.forEach(post => {
        votesMap.set(post.id, { upvotes: 0, downvotes: 0 });
        });
        votesResult.forEach(row => {
        const voteInfo = votesMap.get(row.post_id)!;
        if (row.vote) {
            voteInfo.upvotes = Number(row.count);
        } else {
            voteInfo.downvotes = Number(row.count);
        }
        });

        // 4. Get user vote for each post (if logged in)
        const userVotesMap = new Map<number, boolean>();
        if (userId !== null) {
        const userVotes = await sql`
            SELECT post_id, vote FROM post_votes
            WHERE user_id = ${userId} AND post_id = ANY(${postIds})
        `;
        userVotes.forEach(row => {
            userVotesMap.set(row.post_id, row.vote);
        });
        }
        //geting post authors
        const postAuthorsMap = new Map<number,ShortUser>();
        const postAuthors = await sql`
            SELECT DISTINCT users.id, users.username, users.profile_img_url
            FROM users
            JOIN posts ON posts.author_id = users.id
            WHERE posts.id = ANY(${postIds})

        `
        postAuthors.forEach(row =>{
            postAuthorsMap.set(row.id,(row as ShortUser));
        });
        // 5. Combine everything into EnrichedPost[]
        const enrichedPosts: EnrichedPost[] = rawPosts.map(post => ({
        post,
        commentsAmount: commentCountsMap.get(post.id) ?? 0,
        upvotesAmount: votesMap.get(post.id)?.upvotes ?? 0,
        downvotesAmount: votesMap.get(post.id)?.downvotes ?? 0,
        voted: userVotesMap.get(post.id) ?? null,
        authorUsername:postAuthorsMap.get(post.author_id)?.username??null,
        authorProfPicUrl:postAuthorsMap.get(post.author_id)?.profile_img_url??null,
        }));

        return enrichedPosts;

    } catch (error) {
        console.log(error);
        return [];
    }
}
export async function getVotedPosts(offset:number,voteAuthorId:number): Promise<EnrichedPost[]>{
    try {
        const userId = await verifyToken();
        const rawPosts:PostType[] = await sql`
        SELECT * FROM posts
        WHERE id IN (
        SELECT DISTINCT post_id FROM post_votes WHERE user_id = ${voteAuthorId}
        )
        ORDER BY created_at DESC
        LIMIT 10 OFFSET ${offset}
        `
        if (rawPosts.length === 0) return [];
        const postIds = rawPosts.map(post => post.id);
        // 2. Get comments count per post
        const commentsCountsResult = await sql`
        SELECT post_id, COUNT(*) AS count FROM comments
        WHERE post_id = ANY(${postIds})
        GROUP BY post_id
        `;
        const commentCountsMap = new Map<number, number>();
        commentsCountsResult.forEach(row => {
        commentCountsMap.set(row.post_id, Number(row.count));
        });

        // 3. Get vote counts (upvotes and downvotes)
        const votesResult = await sql`
        SELECT post_id, vote, COUNT(*) as count
        FROM post_votes
        WHERE post_id = ANY(${postIds})
        GROUP BY post_id, vote
        `;
        const votesMap = new Map<number, { upvotes: number; downvotes: number }>();
        rawPosts.forEach(post => {
        votesMap.set(post.id, { upvotes: 0, downvotes: 0 });
        });
        votesResult.forEach(row => {
        const voteInfo = votesMap.get(row.post_id)!;
        if (row.vote) {
            voteInfo.upvotes = Number(row.count);
        } else {
            voteInfo.downvotes = Number(row.count);
        }
        });

        // 4. Get user vote for each post (if logged in)
        const userVotesMap = new Map<number, boolean>();
        if (userId !== null) {
        const userVotes = await sql`
            SELECT post_id, vote FROM post_votes
            WHERE user_id = ${userId} AND post_id = ANY(${postIds})
        `;
        userVotes.forEach(row => {
            userVotesMap.set(row.post_id, row.vote);
        });
        }
        //geting post authors
        const postAuthorsMap = new Map<number,ShortUser>();
        const postAuthors = await sql`
            SELECT DISTINCT users.id, users.username, users.profile_img_url
            FROM users
            JOIN posts ON posts.author_id = users.id
            WHERE posts.id = ANY(${postIds})

        `
        postAuthors.forEach(row =>{
            postAuthorsMap.set(row.id,(row as ShortUser));
        });
        // 5. Combine everything into EnrichedPost[]
        const enrichedPosts: EnrichedPost[] = rawPosts.map(post => ({
        post,
        commentsAmount: commentCountsMap.get(post.id) ?? 0,
        upvotesAmount: votesMap.get(post.id)?.upvotes ?? 0,
        downvotesAmount: votesMap.get(post.id)?.downvotes ?? 0,
        voted: userVotesMap.get(post.id) ?? null,
        authorUsername:postAuthorsMap.get(post.author_id)?.username??null,
        authorProfPicUrl:postAuthorsMap.get(post.author_id)?.profile_img_url??null,
        }));

        return enrichedPosts;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export async function searchPosts(offset:number,query:string):Promise<EnrichedPost[]>{
    const userId = await verifyToken();
    try {
        const keyword = `%${query}%`;
        const rawPosts:PostType[] = await sql`
        SELECT * FROM posts
        WHERE title ILIKE ${keyword} OR text ILIKE ${keyword}
        ORDER BY created_at DESC
        LIMIT 10 OFFSET ${offset}
        `
        if(rawPosts.length===0){
            return [];
        }
        const postIds =rawPosts.map(row=>row.id);
        // 2. Get comments count per post
        const commentsCountsResult = await sql`
        SELECT post_id, COUNT(*) AS count FROM comments
        WHERE post_id = ANY(${postIds})
        GROUP BY post_id
        `;
        const commentCountsMap = new Map<number, number>();
        commentsCountsResult.forEach(row => {
        commentCountsMap.set(row.post_id, Number(row.count));
        });

        // 3. Get vote counts (upvotes and downvotes)
        const votesResult = await sql`
        SELECT post_id, vote, COUNT(*) as count
        FROM post_votes
        WHERE post_id = ANY(${postIds})
        GROUP BY post_id, vote
        `;
        const votesMap = new Map<number, { upvotes: number; downvotes: number }>();
        rawPosts.forEach(post => {
        votesMap.set(post.id, { upvotes: 0, downvotes: 0 });
        });
        votesResult.forEach(row => {
        const voteInfo = votesMap.get(row.post_id)!;
        if (row.vote) {
            voteInfo.upvotes = Number(row.count);
        } else {
            voteInfo.downvotes = Number(row.count);
        }
        });

        // 4. Get user vote for each post (if logged in)
        const userVotesMap = new Map<number, boolean>();
        if (userId !== null) {
        const userVotes = await sql`
            SELECT post_id, vote FROM post_votes
            WHERE user_id = ${userId} AND post_id = ANY(${postIds})
        `;
        userVotes.forEach(row => {
            userVotesMap.set(row.post_id, row.vote);
        });
        }
        //geting post authors
        const postAuthorsMap = new Map<number,ShortUser>();
        const postAuthors = await sql`
            SELECT DISTINCT users.id, users.username, users.profile_img_url
            FROM users
            JOIN posts ON posts.author_id = users.id
            WHERE posts.id = ANY(${postIds})

        `
        postAuthors.forEach(row =>{
            postAuthorsMap.set(row.id,(row as ShortUser));
        });
        // 5. Combine everything into EnrichedPost[]
        const enrichedPosts: EnrichedPost[] = rawPosts.map(post => ({
        post,
        commentsAmount: commentCountsMap.get(post.id) ?? 0,
        upvotesAmount: votesMap.get(post.id)?.upvotes ?? 0,
        downvotesAmount: votesMap.get(post.id)?.downvotes ?? 0,
        voted: userVotesMap.get(post.id) ?? null,
        authorUsername:postAuthorsMap.get(post.author_id)?.username??null,
        authorProfPicUrl:postAuthorsMap.get(post.author_id)?.profile_img_url??null,
        }));

        return enrichedPosts;
        
    } catch (error) {
        console.log(error);
        return [];
    }
}
//


function buildTree(flatList:EnrichedComment[]){
    const idMap: Record<number, CommentNode> = {};
    const tree: CommentNode[] = [];
    flatList.forEach(enrichedComment => {
        idMap[enrichedComment.comment.id] = {...enrichedComment,children: []}
    });
    flatList.forEach(enrichedComment=>{
        if(enrichedComment.comment.parent_id === null) {
            tree.push(idMap[enrichedComment.comment.id]);
        } else {
            const parent = idMap[enrichedComment.comment.parent_id];
            if (parent) {
                parent.children.push(idMap[enrichedComment.comment.id]);
            }
        }
    })
    return tree;
}

export async function getPostAndComments(postId:number){
    try {
        const userId:number|null = await verifyToken();

        const postResult = await sql`
        SELECT * FROM posts WHERE id=${postId}
        `
        if(postResult.length===0){
            throw new Error('post not found');
        }
        const post = postResult[0] as PostType;
        const commentsCountResult = await sql`
        SELECT COUNT(*) FROM comments WHERE post_id = ${postId}
        `
        const upvotesCountResult = await sql`
        SELECT COUNT(*) FROM post_votes WHERE post_id = ${postId} AND vote = true
        `
        const downvotesCountResult = await sql`
        SELECT COUNT(*) FROM post_votes WHERE post_id = ${postId} AND vote = false
        `
        let vote = null;
        if(userId!==null){
            const voteResult = await sql`
            SELECT * FROM post_votes WHERE post_id = ${postId} AND user_id = ${userId} 
            `
            if(voteResult.length!==0){
                vote = voteResult[0].vote??null;
            }
        }
        const user = await getUserById(post.author_id);
        const enrichedPost:EnrichedPost = {
            post: post,
            upvotesAmount:upvotesCountResult[0].count??0,
            downvotesAmount:downvotesCountResult[0].count??0,
            voted:vote,
            commentsAmount:commentsCountResult[0].count??0,
            authorUsername:user!==null?user.username:null,
            authorProfPicUrl:user!==null?user.profile_img_url:null,
        }
        const rawComments:Comment[] = await sql`
        SELECT * FROM comments WHERE post_id=${postId}
        `
        if(rawComments.length===0){
            return {post:enrichedPost,tree:[],userId};
        }
        const commentIds = rawComments.map(comment=>comment.id);
        // 3. Get vote counts (upvotes and downvotes)
        const votesResult = await sql`
        SELECT comment_id, vote, COUNT(*) as count
        FROM comment_votes
        WHERE comment_id = ANY(${commentIds})
        GROUP BY comment_id, vote
        `;
        const votesMap = new Map<number, { upvotes: number; downvotes: number }>();
        rawComments.forEach(comment => {
        votesMap.set(comment.id, { upvotes: 0, downvotes: 0 });
        });
        votesResult.forEach(row => {
        const voteInfo = votesMap.get(row.comment_id)!;
        if (row.vote) {
            voteInfo.upvotes = Number(row.count);
        } else {
            voteInfo.downvotes = Number(row.count);
        }
        });

        // 4. Get user vote for each comment (if logged in)
        const userVotesMap = new Map<number, boolean>();
        if (userId !== null) {
        const userVotes = await sql`
            SELECT comment_id, vote FROM comment_votes
            WHERE user_id = ${userId} AND comment_id = ANY(${commentIds})
        `;
        userVotes.forEach(row => {
            userVotesMap.set(row.comment_id, row.vote);
        });
        }
        //geting authors for each comment
        const commentAuthorsMap = new Map<number,ShortUser>();
        const commentAuthors = await sql`
            SELECT DISTINCT users.id, users.username, users.profile_img_url
            FROM users
            JOIN comments ON comments.author_id = users.id
            WHERE comments.id = ANY(${commentIds})

        `
        commentAuthors.forEach(row =>{
            commentAuthorsMap.set(row.id,(row as ShortUser));
        });
        // 5. Combine everything into EnrichedComment[]
        const enrichedComments: EnrichedComment[] = rawComments.map(comment => ({
        comment,
        upvotesAmount: votesMap.get(comment.id)?.upvotes ?? 0,
        downvotesAmount: votesMap.get(comment.id)?.downvotes ?? 0,
        voted: userVotesMap.get(comment.id) ?? null,
        authorUsername: commentAuthorsMap.get(comment.author_id)?.username??null,
        authorProfPicUrl:commentAuthorsMap.get(comment.author_id)?.profile_img_url??null,
        }));

        const tree = buildTree(enrichedComments);
        return ({post:enrichedPost,tree:tree,userId:userId})
    } catch (error) {
        console.log(error)
        return `error message: ${error}`;
    }
}
export async function createComment(authorId:number,postId:number,parentId:number|null,body:string){
    try {
        const author = await getUserById(authorId);
        if(author===null){
            throw new Error('something went wrong')
        }
        const result = await sql`
        INSERT INTO comments (author_id,post_id,parent_id,body) 
        VALUES (${authorId},${postId},${parentId},${body})
        RETURNING *
        `
        if(result.length===0){
            throw new Error('something went wrong')
        }
        await createNotification(postId,authorId,parentId);
        const comment = result[0] as Comment;

        return {comment:comment,author:author};
    } catch (error) {
        console.log(error);
        return `error message: ${error}`;
    }
}
export async function getAmountOfComments(postId:number){
    try {
        const result = await sql`
        SELECT COUNT(*) FROM comments
        WHERE post_id = ${postId}
        `
        const count = Number(result[0].count??0);
        return count;
    } catch (error) {
        console.log(error);
        return 0;
    }
}
//votes(like/dislike for posts and comments)
//posts
export async function votePost(vote:boolean,postId:number,userId:number){
    try {
        const existing = await sql`
        SELECT vote FROM post_votes
        WHERE user_id = ${userId} AND post_id = ${postId}
        `
        if(existing.length===0){
            await sql`
            INSERT INTO post_votes (user_id,post_id,vote)
            VALUES (${userId},${postId},${vote})
            `
        }else if(existing[0].vote===vote){
            await sql`
            DELETE FROM post_votes
            WHERE user_id = ${userId} AND post_id = ${postId}
            `
        }else{
            await sql`
            UPDATE post_votes
            SET vote = ${vote}
            WHERE user_id = ${userId} AND post_id = ${postId}
            `
        }
    } catch (error) {
        console.log(error);
    }
}
export async function getPostVotesAmount(postId:number){
    try {
        const result1 = await sql`
        SELECT COUNT(*) FROM post_votes
        WHERE post_id = ${postId} AND vote = true
        `
        const result2 = await sql`
        SELECT COUNT(*) FROM post_votes
        WHERE post_id = ${postId} AND vote = false
        `
        const upvotes = Number(result1[0].count??0);
        const downvotes = Number(result2[0].count??0);
        return {upvotes,downvotes};
    } catch (error) {
        console.log(error);
        return {upvotes:0,downvotes:0}
    }
}
export async function checkPostVote(postId:number,userId:number): Promise<null|boolean>{
    //returns true false or null
    //true means upvote, false means downvote, null means no vote
    try {
        const result = await sql`
        SELECT * FROM post_votes
        WHERE post_id=${postId} AND user_id=${userId}
        `
        if(result.length===0){
            return null;
        }else{
            return result[0].vote;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
//coments
export async function voteComment(vote:boolean,commentId:number,userId:number){
    try {
        const existing = await sql`
        SELECT vote FROM comment_votes
        WHERE user_id = ${userId} AND comment_id = ${commentId}
        `
        if(existing.length===0){
            await sql`
            INSERT INTO comment_votes (user_id,comment_id,vote)
            VALUES (${userId},${commentId},${vote})
            `
        }else if(existing[0].vote===vote){
            await sql`
            DELETE FROM comment_votes
            WHERE user_id = ${userId} AND comment_id = ${commentId}
            `
        }else{
            await sql`
            UPDATE comment_votes
            SET vote = ${vote}
            WHERE user_id = ${userId} AND comment_id = ${commentId}
            `
        }
    } catch (error) {
        console.log(error);
    }
}
export async function getCommentVotesAmount(commentId:number){
    try {
        const result1 = await sql`
        SELECT COUNT(*) FROM comment_votes
        WHERE comment_id = ${commentId} AND vote = true
        `
        const result2 = await sql`
        SELECT COUNT(*) FROM comment_votes
        WHERE comment_id = ${commentId} AND vote = false
        `
        const upVotes = Number(result1[0].count??0);
        const downVotes = Number(result2[0].count??0);
        return {upVotes,downVotes};
    } catch (error) {
        console.log(error);
    }
}
export async function checkCommentVote(commentId:number,userId:number){
    //return true false or null
    //true means upvote, false means downvote, null means no vote
    try {
        const result = await sql`
        SELECT * FROM comment_votes
        WHERE comment_id=${commentId} AND user_id=${userId}
        `
        if(result.length===0){
            return null;
        }else{
            return result[0].vote;
        }
    } catch (error) {
        console.log(error);
    }
}


export async function editUser(userId:number,username:string,email:string,profileImgUrl:null|string){
    try {
        if(profileImgUrl===null){
            await sql `
            UPDATE users
            SET username = ${username}, email = ${email}
            WHERE id = ${userId}
            `
        }else{
            await sql `
            UPDATE users
            SET username = ${username}, email = ${email}, profile_img_url = ${profileImgUrl}
            WHERE id = ${userId}
            `
        }
        return 'success!';
    } catch (error) {
        console.log(error);
        return `Error message: ${error}`
    }
}
//creating notifications, they are going to be created when someone comments under user post(first tree level comment) or someone answers to user comment
async function createNotification(post_id:number,author_id:number,comment_id:number|null) {
    //comment_id stands for id of coment that users replies to, if it's null notification will be sent to post author, else to comment author
    try {
        const answer = await sql`
        SELECT author_id FROM posts WHERE id = ${post_id}
        `
        const post_author_id = answer[0].author_id as number;
        if(comment_id===null){
            if(post_author_id===author_id){
                return;
            }
            await sql`
                INSERT INTO notifications (post_id,author_id,receiver_id)
                VALUES (${post_id},${author_id},${post_author_id})
            `
        }else{
            //it seems like this function don't need comment id, but:
            //if comment is an answer to another comment then using comment id function will find
            //author of comment id and set receiver id to it
            const answer = await sql`
            SELECT * FROM comments WHERE id = ${comment_id}
            `
            if(answer.length===0){
                throw new Error('comment not found');
            }
            const comment = answer[0] as Comment;
            if(comment.author_id===author_id){
                return;
            }
            await sql `
                INSERT INTO notifications (post_id,author_id,receiver_id,comment_id)
                VALUES (${post_id},${author_id},${comment.author_id},${comment_id})
            `
        }
    } catch (error) {
        console.log(error);
    }
}
export async function getNotifications(userId:number){
    try {
        const notifications:Notification[] = await sql`
        SELECT * FROM notifications WHERE receiver_id = ${userId}
        `
        if(notifications.length===0){
            return [];
        }
        const notificationIds = notifications.map(row=>row.id);
        //geting authors for each notification
        const notificationAuthorsMap = new Map<number,ShortUser>();
        const notificationAuthors = await sql`
            SELECT DISTINCT users.id, users.username, users.profile_img_url
            FROM users
            JOIN notifications ON notifications.author_id = users.id
            WHERE notifications.id = ANY(${notificationIds})
        `
        notificationAuthors.forEach(row =>{
            notificationAuthorsMap.set(row.id,(row as ShortUser));
        });
        // 5. Combine everything into EnrichedNotification[]
        const enrichedNotifications:EnrichedNotification[] = notifications.map((notification)=>({
            notification,
            authorUsername:notificationAuthorsMap.get(notification.author_id)?.username??null,
            authorProfPicUrl:notificationAuthorsMap.get(notification.author_id)?.profile_img_url??null,
        }))
        return enrichedNotifications;
    } catch (error) {
        console.log(error);
        return `error message: ${error}`
    }
}
export async function getNotificationsCount(userId:number){
    try {
        const result = await sql`
        SELECT COUNT(*) FROM notifications
        WHERE receiver_id = ${userId} AND is_read = false
        `
        const count = Number(result[0].count??0);
        return count;
    } catch (error) {
        console.log(error);
        return null;
    }
}
export async function markNotificationsAsRead(userId:number){
    try {
        await sql`
        UPDATE notifications
        SET is_read = true
        WHERE receiver_id = ${userId} AND is_read = false
        `
    } catch (error) {
        console.log(error);
    }
}
export async function deleteNotifications(userId:number){
    try {
        await sql`
        DELETE FROM notifications WHERE receiver_id = ${userId}
        `
    } catch (error) {
        console.log(error);
    }
}
