import SearchPage from "../ui/components/searchPage";
import { searchPosts } from "@/app/lib/db";
import { Suspense } from "react";
import { verifyToken } from "../lib/jwt";
import { redirect } from "next/navigation";
interface SearchPageProps {
    searchParams: Promise<{ q?: string }>; // ✅ searchParams as a Promise
}
export default async function Page({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  if(!q){
    redirect('/')
  }
  const query = typeof q === "string" ? q : ""; 
  const initialPosts = await searchPosts(0, query);
  const isVerifyed = await verifyToken();

  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchPage initialPosts={initialPosts} query={query} isVerifyed={isVerifyed}/>
    </Suspense>
  );
}
/*import Search from "@/components/common/search";
import DocsTable from "@/components/documents/doc-table";
import { fetchDocsBySearch } from "@/db/queries/docs";


interface SearchPageProps {
    searchParams: Promise<{ term?: string }>; // ✅ searchParams as a Promise
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { term } = await searchParams; // ✅ Await the promise

    if (!term) {
        redirect("/");
    }

    return (
        <div className="m-10 space-y-4">
            <h1>Documents</h1>

            <div className="w-1/4">
                <Search />
            </div>

            <DocsTable fetchData={() => fetchDocsBySearch(term)} />
        </div>
    );
}*/
