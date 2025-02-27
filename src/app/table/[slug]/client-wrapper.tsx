"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const ClientWrapper = ({ children }: { children: ReactNode }) => {
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  } else return children;
};

export default ClientWrapper;
