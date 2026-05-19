// frontend/src/components/ProductDetailSkeleton.jsx
export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 bg-white rounded-xl shadow-md p-8">
        {/* Image */}
        <div className="bg-gray-200 rounded-xl min-h-[500px] animate-pulse"></div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div> {/* Title */}
          <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div> {/* Description line 1 */}
          <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div> {/* Description line 2 */}
          <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div> {/* Description line 3 */}
          <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div> {/* Price */}
          <div className="h-12 bg-gray-200 rounded w-full animate-pulse mt-6"></div> {/* Button */}
        </div>
      </div>
    </div>
  );
}