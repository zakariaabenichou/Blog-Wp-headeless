// src/components/SkeletonCard.tsx

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Image Placeholder */}
      <div className="h-64 w-full bg-gray-200 animate-pulse"></div>
      
      {/* Content Placeholder */}
      <div className="p-6 text-center">
        {/* Category Placeholder */}
        <div className="h-4 w-1/3 bg-gray-200 rounded-full mx-auto animate-pulse mb-4"></div>
        {/* Title Placeholder */}
        <div className="h-8 w-3/4 bg-gray-200 rounded-full mx-auto animate-pulse mb-3"></div>
        {/* Summary Placeholder */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );
}