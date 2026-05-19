// frontend/src/components/SkeletonCard.jsx

export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border rounded-lg p-4 shadow-md flex flex-col gap-3">
      <div className="bg-gray-200 h-48 rounded w-full"></div> {/* image placeholder */}
      <div className="h-6 bg-gray-200 rounded w-3/4"></div> {/* title */}
      <div className="h-4 bg-gray-200 rounded w-1/2"></div> {/* price */}
      <div className="h-8 bg-gray-200 rounded w-full mt-2"></div> {/* button */}
    </div>
  );
}