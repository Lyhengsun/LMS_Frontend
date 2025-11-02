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

const mockLeaderboardData: Leaderboard[] = [
  {
    quizPoints: 450,
    coursePoints: 380,
    assignmentPoints: 320,
    totalPoints: 1150,
    student: {
      id: "4  ",
      fullName: "Student",
      email: "sarah.johnson@example.com",
      bio: "Computer Science student passionate about web development",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      phoneNumber: "+1234567890",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      createdAt: "2024-01-15T08:00:00Z",
      editedAt: "2025-10-10T14:30:00Z",
    },
  },
  {
    quizPoints: 420,
    coursePoints: 365,
    assignmentPoints: 310,
    totalPoints: 1095,
    student: {
      id: "usr_002",
      fullName: "Michael Chen",
      email: "michael.chen@example.com",
      bio: "Data Science enthusiast and machine learning practitioner",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      phoneNumber: "+1234567891",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      createdAt: "2024-02-01T09:15:00Z",
      editedAt: "2025-10-12T16:45:00Z",
    },
  },
  {
    quizPoints: 400,
    coursePoints: 340,
    assignmentPoints: 295,
    totalPoints: 1035,
    student: {
      id: "usr_003",
      fullName: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      bio: "Full-stack developer and open source contributor",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      phoneNumber: "+1234567892",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      createdAt: "2024-01-20T10:30:00Z",
      editedAt: "2025-10-11T11:20:00Z",
    },
  },
  {
    quizPoints: 380,
    coursePoints: 320,
    assignmentPoints: 280,
    totalPoints: 980,
    student: {
      id: "usr_004",
      fullName: "David Kim",
      email: "david.kim@example.com",
      bio: "Mobile app developer specializing in React Native",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      createdAt: "2024-02-10T13:45:00Z",
      editedAt: "2025-10-13T09:10:00Z",
    },
  },
  {
    quizPoints: 360,
    coursePoints: 305,
    assignmentPoints: 265,
    totalPoints: 930,
    student: {
      id: "usr_005",
      fullName: "Jessica Taylor",
      email: "jessica.taylor@example.com",
      bio: "UI/UX designer transitioning to frontend development",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      phoneNumber: "+1234567893",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      createdAt: "2024-03-05T11:00:00Z",
      editedAt: "2025-10-09T15:30:00Z",
    },
  },
  {
    quizPoints: 340,
    coursePoints: 290,
    assignmentPoints: 250,
    totalPoints: 880,
    student: {
      id: "usr_006",
      fullName: "Alex Martinez",
      email: "alex.martinez@example.com",
      bio: "Cybersecurity student and ethical hacker",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      phoneNumber: "+1234567894",
      avatarUrl: "https://i.pravatar.cc/150?img=6",
      createdAt: "2024-02-15T14:20:00Z",
      editedAt: "2025-10-08T12:40:00Z",
    },
  },
  {
    quizPoints: 320,
    coursePoints: 275,
    assignmentPoints: 235,
    totalPoints: 830,
    student: {
      id: "usr_007",
      fullName: "Olivia Brown",
      email: "olivia.brown@example.com",
      bio: "Game developer and Unity enthusiast",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      avatarUrl: "https://i.pravatar.cc/150?img=7",
      createdAt: "2024-03-20T16:30:00Z",
      editedAt: "2025-10-07T10:15:00Z",
    },
  },
  {
    quizPoints: 300,
    coursePoints: 260,
    assignmentPoints: 220,
    totalPoints: 780,
    student: {
      id: "usr_008",
      fullName: "James Wilson",
      email: "james.wilson@example.com",
      bio: "DevOps engineer learning cloud architecture",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      phoneNumber: "+1234567895",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
      createdAt: "2024-01-25T08:45:00Z",
      editedAt: "2025-10-06T14:50:00Z",
    },
  },
  {
    quizPoints: 280,
    coursePoints: 245,
    assignmentPoints: 205,
    totalPoints: 730,
    student: {
      id: "usr_009",
      fullName: "Sophia Anderson",
      email: "sophia.anderson@example.com",
      bio: "Blockchain developer exploring Web3 technologies",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      avatarUrl: "https://i.pravatar.cc/150?img=9",
      createdAt: "2024-04-01T12:00:00Z",
      editedAt: "2025-10-05T13:25:00Z",
    },
  },
  {
    quizPoints: 260,
    coursePoints: 230,
    assignmentPoints: 190,
    totalPoints: 680,
    student: {
      id: "usr_010",
      fullName: "Daniel Lee",
      email: "daniel.lee@example.com",
      bio: "AI/ML researcher and Python developer",
      role: "ROLE_STUDENT",
      isVerified: true,
      isDisabled: false,
      isApproved: true,
      phoneNumber: "+1234567896",
      avatarUrl: "https://i.pravatar.cc/150?img=10",
      createdAt: "2024-03-10T15:15:00Z",
      editedAt: "2025-10-04T11:00:00Z",
    },
  },
];

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
