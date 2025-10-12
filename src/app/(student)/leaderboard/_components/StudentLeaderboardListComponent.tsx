"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllLeaderboardsAction } from "@/src/action/leaderboardAction";
import { Leaderboard } from "@/src/type/Leaderboard";
import { Trophy, Medal, Star, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import StudentLeaderboardCardComponent from "./StudentLeaderboardCardComponent";
import useDebounce from "@/src/lib/hooks/useDebounce";
import { toast } from "sonner";

type RankedLeaderboard = {
  rankNumber: number;
  leaderboard: Leaderboard;
};

const StudentLeaderboardListComponent = ({
  currentUserLeaderboard,
}: {
  currentUserLeaderboard: Leaderboard;
}) => {
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard[]>([]);
  const [page, setPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const debouncedSearchName = useDebounce(searchName, 300);

  const rankLeaderboard = (): RankedLeaderboard[] => {
    let rankNumber = 0;
    let rankoffset = 1;
    const rankedLeaderboard: RankedLeaderboard[] = [];
    leaderboardData.forEach((leaderboard, index) => {
      if (
        index > 0 &&
        leaderboardData[index - 1].totalPoints == leaderboard.totalPoints
      ) {
        rankoffset += 1;
      } else {
        rankNumber += rankoffset;
        rankoffset = 1;
      }
      rankedLeaderboard.push({
        rankNumber: rankNumber,
        leaderboard: leaderboard,
      });
    });
    return rankedLeaderboard;
  };

  // Load courses with pagination
  const loadLeaderboard = async () => {
    const data = await getAllLeaderboardsAction(
      page,
      10, // page size
      debouncedSearchName
    );

    if (data.success) {
      const pagination = data.data?.pagination;
      setHasNextPage(pagination!.currentPage < pagination!.totalPages);
      return data.data?.items!;
    } else {
      toast.error("Failed to fetch leaderboard");
      setHasNextPage(false);
    }
  };

  // Update courses based on page changes
  const updateLeaderboard = async () => {
    if (page === 1) {
      const newLoadedLeaderboards = await loadLeaderboard();
      setLeaderboardData(newLoadedLeaderboards!);
    }
    if (oldPage < page) {
      const newLoadedLeaderboard = await loadLeaderboard();
      setLeaderboardData((prevCourses) => [
        ...prevCourses,
        ...newLoadedLeaderboard!,
      ]);
    }
    setOldPage(page);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    updateLeaderboard();
  }, [page]);

  // Update course list when searching
  useEffect(() => {
    setPage(1);
    const reloadLeaderboards = async () => {
      const leaderboard = await loadLeaderboard();
      if (leaderboard) {
        setLeaderboardData(leaderboard);
      }
    };

    if (oldPage === page) {
      reloadLeaderboards();
    }
  }, [debouncedSearchName]);

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by student name..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
          }}
          className="pl-10"
        />
      </div>

      {/* Leaderboard List */}
      {/* {rankLeaderboard().map((leaderboard, index) => (
        <StudentLeaderboardCardComponent
          key={leaderboard.leaderboard.student.id}
          rankNumber={leaderboard.rankNumber}
          student={leaderboard.leaderboard}
          isCurrentUser={
            leaderboard.leaderboard.student.id ==
            currentUserLeaderboard.student.id
          }
        />
      ))} */}

      {leaderboardData.map((leaderboard, index) => (
        <StudentLeaderboardCardComponent
          key={index}
          rankNumber={index + 1}
          student={leaderboard}
          isCurrentUser={
            leaderboard.student.id == currentUserLeaderboard.student.id
          }
        />
      ))}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && leaderboardData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No students found</p>
        </div>
      )}

      {/* Show More Button */}
      {hasNextPage && !loading && leaderboardData.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button onClick={handleShowMore} variant="outline" disabled={loading}>
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentLeaderboardListComponent;
