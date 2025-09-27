// src/app/page.tsx
"use client";
import { useState } from "react";
import LandingPage from "../components/LandingPage";
import MissionPath from "../components/MissionPath";
import MissionParameters from "../components/MissionPrameters";
import Summary from "../components/Summary";
import { MissionProvider } from "../components/MissionContext";

export default function Home() {
  const [step, setStep] = useState<number>(1);

  return (
    <MissionProvider>
      {step === 1 && <LandingPage nextStep={() => setStep(2)} />}
      {step === 2 && <MissionPath nextStep={() => setStep(3)} />}
      {step === 3 && <MissionParameters nextStep={() => setStep(4)} />}
      {step === 4 && <Summary />}
    </MissionProvider>
  );
}
