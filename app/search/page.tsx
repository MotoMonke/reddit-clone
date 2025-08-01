import SearchPage from "../ui/components/searchPage";
import { searchPosts } from "@/app/lib/db";
import { PostType } from "@/app/lib/types";
import { Suspense } from "react";
interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
export default async function Page({ searchParams }: SearchResultsProps) {
  const params = (await searchParams).q;
  const query = typeof params === "string" ? params : ""; 
  const initialPosts: PostType[] = await searchPosts(0, query);

  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchPage initialPosts={initialPosts} query={query}/>
    </Suspense>
  );
}
