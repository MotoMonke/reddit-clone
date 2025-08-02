import SearchPage from "../ui/components/searchPage";
import { searchPosts } from "@/app/lib/db";
import { EnrichedPost, PostType } from "@/app/lib/types";
import { Suspense } from "react";
import { verifyToken } from "../lib/jwt";
interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
export default async function Page({ searchParams }: SearchResultsProps) {
  
  const params = (await searchParams).q;
  const query = typeof params === "string" ? params : ""; 
  const initialPosts = await searchPosts(0, query);
  const isVerifyed = await verifyToken();
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchPage initialPosts={initialPosts} query={query} isVerifyed={isVerifyed}/>
    </Suspense>
  );
}
