"use client";
import { Suspense } from "react";
import { BiLoader } from "react-icons/bi";
import { WaitingComponent } from "./waiting-comp";

const WaitingPage = () => {
  return (
    <Suspense fallback={<BiLoader size={62} className="animate-spin" />}>
      <WaitingComponent />
    </Suspense>
  );
};

export default WaitingPage;
