// src/app/page.tsx
"use client";
import LandingPage from "../components/HabitatEditor/LandingPage";
import MissionPath from "../components/HabitatEditor/MissionPath";
import MissionParameters from "../components/HabitatEditor/MissionPrameters";
import Summary from "../components/HabitatEditor/Summary";
import { MissionProvider } from "../components/HabitatEditor/MissionContext";
import CharacterGuide from "@/components/HabitatEditor/CharacterGuide";
import StarfieldBackground from "@/components/HabitatEditor/StarfieldBackground";
import {useState} from "react"

export default function Home() {
  const [step, setStep] = useState<number>(1);

  return (

    <StarfieldBackground>
    <MissionProvider>
      <CharacterGuide step={step} nextStep={() => setStep(step + 1)} />


      {step === 1 && <LandingPage nextStep={() => setStep(2)} />}
      {step === 2 && <MissionPath nextStep={() => setStep(3)} />}
      {step === 3 && <MissionParameters nextStep={() => setStep(4)} />}
      {step === 4 && <Summary />}
    </MissionProvider>
     </StarfieldBackground>

  );
}
