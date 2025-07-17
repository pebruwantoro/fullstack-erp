export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrevPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-auto pt-6 flex items-center justify-start">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 text-white rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-chevron-left" />
      </button>
      <span className="text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-gray-700 text-white rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
}
