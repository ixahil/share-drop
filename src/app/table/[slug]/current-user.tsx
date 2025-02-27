"use client";

const CurrentUserState = ({ host }: { host: string }) => {
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  return currentUser?.name || host;
};

export default CurrentUserState;
