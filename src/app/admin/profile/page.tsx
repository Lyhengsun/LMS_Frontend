import React from "react";
import UserProfilePageComponent from "../../_components/ProfilePageComponent";
import { getCurrentUser } from "@/src/service/auth.service";
import ErrorPageComponent from "../../_components/ErrorPageComponent";

const AdminSettingPage = async () => {

  const currentUser = await getCurrentUser();

  console.log("[Intructor Profile Page] Current User: ", currentUser?.payload)
  if (!currentUser?.payload) {
    return <ErrorPageComponent message="Failed to fetch User for Profile" />
  }

  return <UserProfilePageComponent currentUser={currentUser!.payload!} />;
};

export default AdminSettingPage;
