import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

const CustomPaginationOnClick = ({
  currentPage,
  maxPage,
  nextOnClick,
  previousOnClick,
}: {
  currentPage: number;
  maxPage: number;
  nextOnClick: Function;
  previousOnClick: Function;
}) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={() => previousOnClick()}
            aria-disabled={currentPage == 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage} / {maxPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className="cursor-pointer">
          <PaginationNext
            onClick={() => nextOnClick()}
            aria-disabled={currentPage == maxPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPaginationOnClick;
