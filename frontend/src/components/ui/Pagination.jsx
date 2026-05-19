import React from "react";

/**
 * Reusable pagination component for DRF-style pagination
 *
 * Props:
 * - page: current page number
 * - setPage: function to update page
 * - next: URL or null
 * - previous: URL or null
 * - loading: optional disable state
 */
export default function Pagination({
  page,
  setPage,
  next,
  previous,
  loading = false,
}) {
  const goNext = () => {
    if (next && !loading) {
      setPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (previous && page > 1 && !loading) {
      setPage((p) => p - 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">

      <button
        onClick={goPrev}
        disabled={!previous || loading}
        className={`px-4 py-2 rounded transition ${
          previous && !loading
            ? "bg-gray-200 hover:bg-gray-300"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {page}
      </span>

      <button
        onClick={goNext}
        disabled={!next || loading}
        className={`px-4 py-2 rounded transition ${
          next && !loading
            ? "bg-gray-200 hover:bg-gray-300"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
      </button>

    </div>
  );
}