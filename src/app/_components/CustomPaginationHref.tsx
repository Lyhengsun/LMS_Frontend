import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

const CustomPaginationHref = ({
  currentPage,
  maxPage,
  nextHref,
  previousHref,
}: {
  currentPage: number;
  maxPage: number;
  nextHref: string;
  previousHref: string;
}) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousHref}
            aria-disabled={currentPage == 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage} / {maxPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={nextHref}
            aria-disabled={currentPage == maxPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPaginationHref;
