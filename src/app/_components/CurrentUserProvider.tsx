"use client";
import { useUserStore } from "@/src/store/useUserStore";
import React, { useEffect } from "react";

const CurrentUserProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);
  return <>{children}</>;
};

export default CurrentUserProvider;
