import React from "react";
import Link from "next/link";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { GithubIcon } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/bg-beams";
import { SparklesCore } from "@/components/ui/sparkles-core";
import { EyeCatchingButton_v1 } from "@/components/ui/shimmer-button";
import { SiteFooter } from "@/components/footer";

const words = [
  {
    text: "Share",
  },
  {
    text: "files",
  },
  {
    text: "blazingly",
  },
  {
    text: "fast",
  },
  {
    text: "using",
  },
  {
    text: "SharePro.",
    className: "underline text-blue-500 dark:text-blue-500",
  },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden h-[40rem]">
      <BackgroundBeams className="hidden md:block" />
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="absolute inset-0 z-0 block md:hidden"
        particleColor={"#FFFFFF"}
      />
      <TypewriterEffectSmooth words={words} />A peer-to-peer file sharing app.
      <div className="mt-8 gap-3 flex justify-center z-10">
        <Link href="/share">
          <EyeCatchingButton_v1>Start sharing</EyeCatchingButton_v1>
        </Link>
        <Link
          href={"https://github.com/ixahil/share-drop"}
          className="flex items-center"
        >
          <EyeCatchingButton_v1>
            <GithubIcon size={18} className="mr-2" />
            GitHub Repo
          </EyeCatchingButton_v1>
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
};

export default Home;
