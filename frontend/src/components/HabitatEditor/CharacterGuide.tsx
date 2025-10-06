// src/components/CharacterGuide.tsx
"use client";
import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import axios from "axios";
import astronautAnimation from "../HabitatEditor/assets/astronaut.json";

interface Props {
  step: number;
  nextStep: () => void;
}

const messages: Record<number, string> = {
  1: "🚀 Welcome to SpaceVastu! Let's start your mission by setting the stage.",
  2: "✨ Select your destination: Moon or Mars? This defines your environment and constraints.",
  3: "🛰️ Critical parameters! Crew size, duration, and habitat type impact everything. Choose wisely.",
  4: "✅ Mission briefing complete. Proceed to the Habitat Builder to design your layout!",
};

export default function CharacterGuide({ step, nextStep }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const playVoice = async () => {
      const text = messages[step];
      if (!text) return;

      try {
        // Call Eleven Labs TTS API
        const response = await axios.post(
          "https://api.elevenlabs.io/v1/text-to-speech/B5vjwBxGgp4GLTiUjDxM", // Replace <YOUR_VOICE_ID>
          {
            text,
            model_id: "eleven_multilingual_v2", // better quality
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          },
          {
            headers: {
              "Accept": "audio/mpeg",
              "xi-api-key": process.env.NEXT_PUBLIC_ELEVEN_API_KEY || "", // put in .env
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
          }
        );

        // Convert audio buffer to blob and play
        const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } catch (err) {
        console.error("Error with Eleven Labs TTS:", err);
      }
    };

    playVoice();
  }, [step]);

  return (
    <div className="fixed bottom-4 left-5 z-[100] flex items-end space-x-2 pointer-events-none">
      {/* Astronaut animation */}
      <div className="w-52 h-52 pointer-events-auto">
        <Lottie animationData={astronautAnimation} loop />
      </div>

      {/* Speech bubble */}
      <div className="relative p-0 max-w-sm pointer-events-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-blue-500/50 rounded-2xl p-4 shadow-2xl shadow-blue-500/30">
          <p className="text-blue-200 font-mono text-sm">{messages[step]}</p>
          <div className="mt-2 flex justify-end">
            {step < 4 && (
              <button
                onClick={nextStep}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition duration-200 shadow-md pointer-events-auto"
              >
                Proceed &gt;
              </button>
            )}
          </div>
        </div>
        <div className="absolute left-[-10px] bottom-1/4 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-blue-500/50"></div>
      </div>

      {/* Hidden audio player */}
      <audio ref={audioRef} />
    </div>
  );
}
