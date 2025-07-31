import { Suspense } from "react";
import SearchResults from "../ui/components/sarchResults";
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
