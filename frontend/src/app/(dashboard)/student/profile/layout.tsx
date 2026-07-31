"use client";

import React from "react";
import ProfileUsersPage from "./components/profileUsers";

const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="pb-12">
      <ProfileUsersPage />
      {children}
    </div>
  );
};

export default ProfileLayout;
