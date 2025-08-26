import React from "react";
import UserManagementPageComponent from "./_components/UserManagementPageComponent";
import User from "@/src/type/User";
import { getAllUserForAdminService } from "@/src/service/user.service";

const UserManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // let { page } = await searchParams;
  // if (!page) {
  //   page = "1";
  // }
  // const size = "5";

  // const res = await getAllUserForAdminService(
  //   parseInt(page as string),
  //   parseInt(size as string),
  //   true
  // );

  const unapprovedRes = await getAllUserForAdminService(
    1,
    10,
    false
  );
  return (
    <UserManagementPageComponent
      fetchedUnapprovedUsers={unapprovedRes.payload}
    />
  );
};

export default UserManagementPage;
