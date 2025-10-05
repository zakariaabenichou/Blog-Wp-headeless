// src/app/loading.tsx
import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  // This UI will be displayed as a fallback while the page's data is loading.
  return (
    <main className="bg-light-gray">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:p-8">
        {/* Placeholder for a title */}
        <div className="h-10 w-1/2 bg-gray-200 rounded-full mx-auto animate-pulse mb-8"></div>
        
        <div className="grid grid-cols-1 sm-grid-cols-2 lg:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </main>
  );
}