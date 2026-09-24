import type { Metadata } from "next";
import { ProgressIndicator } from "@/components/layout/ProgressIndicator";
import { KeyboardNav } from "@/components/layout/KeyboardNav";
import { BackgroundField } from "@/components/layout/BackgroundField";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { OpeningTitle } from "@/components/sections/OpeningTitle";
import { Hero } from "@/components/sections/Hero";
import { Challenges } from "@/components/sections/Challenges";
import { Connect } from "@/components/sections/Connect";
import { Workflow } from "@/components/sections/Workflow";
import { Improve } from "@/components/sections/Improve";
import { Accuracy } from "@/components/sections/Accuracy";
import { Cases } from "@/components/sections/Cases";
import { Roadmap } from "@/components/sections/Roadmap";

export const metadata: Metadata = {
  title: "Platform Engineering Support",
  description:
    "How PE Support investigations are triaged, how evidence is gathered across systems, and how recommendations are reviewed before anything ships.",
};

export default function Home() {
  return (
    <>
      <BackgroundField />
      <BrandLockup />
      <ProgressIndicator />
      <KeyboardNav />
      <main className="relative z-10">
        <OpeningTitle />
        <Challenges />
        <Hero />
        <Connect />
        <Workflow />
        <Improve />
        <Accuracy />
        <Cases />
        <Roadmap />
      </main>
    </>
  );
}
