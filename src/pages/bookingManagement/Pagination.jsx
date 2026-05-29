import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, lastPage } = pagination;

  if (lastPage <= 1) return null;

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  const maxVisible = 5;

  if (lastPage <= maxVisible) {
    for (let i = 1; i <= lastPage; i++) pageNumbers.push(i);
  } else if (currentPage <= 3) {
    for (let i = 1; i <= maxVisible; i++) pageNumbers.push(i);
  } else if (currentPage >= lastPage - 2) {
    for (let i = lastPage - maxVisible + 1; i <= lastPage; i++) pageNumbers.push(i);
  } else {
    for (let i = currentPage - 2; i <= currentPage + 2; i++) pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="font-bold text-black border border-black p-2 transition-all hover:bg-black hover:border-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} />
      </button>

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`border border-black px-3 py-1 transition-all hover:bg-black/50 ${
            currentPage === pageNum ? "bg-black text-white" : "text-black"
          }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={goToNextPage}
        disabled={currentPage === lastPage}
        className="text-black font-bold border border-black p-2 transition-all hover:bg-black hover:border-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;
