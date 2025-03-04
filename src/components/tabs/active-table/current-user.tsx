"use client";

import { useStore } from "@/lib/store";

const CurrentUserState = () => {
  const { user } = useStore();

  return user?.name || "UNKNOWN";
};

export default CurrentUserState;
