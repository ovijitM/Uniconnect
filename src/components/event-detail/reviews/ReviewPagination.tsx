
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ReviewPagination: React.FC<ReviewPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)} 
              className="cursor-pointer"
            />
          </PaginationItem>
        )}
        
        {/* First page */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => onPageChange(1)}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Ellipsis if needed */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Previous page if not first */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => onPageChange(currentPage - 1)}
              className="cursor-pointer"
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Current page */}
        <PaginationItem>
          <PaginationLink 
            isActive
            className="cursor-default"
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        
        {/* Next page if not last */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => onPageChange(currentPage + 1)}
              className="cursor-pointer"
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Ellipsis if needed */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Last page */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)} 
              className="cursor-pointer"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default ReviewPagination;
