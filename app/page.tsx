"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [atcVolume, setAtcVolume] = useState(0);
  const [lofiVolume, setLofiVolume] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const atcAudioRef = useRef<HTMLAudioElement>(null);
  const lofiAudioRef = useRef<HTMLAudioElement>(null);

  // Create stable audio URLs that won't change on re-renders
  const atcAudioUrl = useRef(
    `https://s1-fmt2.liveatc.net/ksfo_twr?nocache=${Date.now()}`
  );

  const lofiAudioUrl =
    "https://cdn.lofiatc.brandonhol.land/lofi/2GjPQfdQfMY.mp3";
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // ATC audio control
  useEffect(() => {
    const atcAudio = atcAudioRef.current;
    if (!atcAudio || !userInteracted) return;

    atcAudio.volume = atcVolume / 100;

    if (atcVolume > 0) {
      atcAudio.muted = false;
      if (atcAudio.paused) {
        atcAudio
          .play()
          .catch((e) => console.error("ATC audio play failed:", e));
      }
    } else {
      // Just mute the audio instead of pausing it
      atcAudio.muted = true;
    }

    // Don't pause in the cleanup function for ATC
    return () => {};
  }, [atcVolume, userInteracted]);

  // Lofi audio control
  useEffect(() => {
    const lofiAudio = lofiAudioRef.current;
    if (!lofiAudio || !userInteracted) return;

    lofiAudio.volume = lofiVolume / 100;

    if (lofiVolume > 0) {
      lofiAudio.muted = false;
      if (lofiAudio.paused) {
        lofiAudio
          .play()
          .catch((e) => console.error("Lofi audio play failed:", e));
      }
    } else {
      lofiAudio.muted = true;
    }

    return () => {
      lofiAudio.pause();
    };
  }, [lofiVolume, userInteracted]);

  return (
    <>
      <audio
        ref={atcAudioRef}
        src={atcAudioUrl.current}
        muted
        suppressHydrationWarning
      />
      <audio
        ref={lofiAudioRef}
        src={lofiAudioUrl}
        muted
        loop
        suppressHydrationWarning
      />
      <div className="h-screen w-screen flex items-center justify-center p-4">
        <div className="rounded-lg border p-4 w-full max-w-md">
          <h1 className="text-xl md:text-2xl mb-4 text-center tracking-tight text-balance font-medium">
            Lofi ATC
          </h1>
          <div className="mb-4">
            <Select defaultValue="sfo-tower">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ATC feed" />
              </SelectTrigger>
              <SelectContent className="bg-black">
                <SelectItem value="sfo-tower" className="">
                  SFO - San Francisco Tower
                </SelectItem>
                <SelectItem value="jfk-tower" className="truncate">
                  JFK - New York JFK Tower
                </SelectItem>
                <SelectItem value="lax-tower" className="">
                  LAX - Los Angeles Tower
                </SelectItem>
                <SelectItem value="san-tower" className="">
                  SAN - San Diego Tower
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
            <div className="flex-1">
              <div className="text-xs mb-2">ATC</div>
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                className="bg-white rounded-2xl"
                onValueChange={(values) => setAtcVolume(values[0])}
              />
            </div>
            <div className="flex-1">
              <div className="text-xs mb-2">LOFI</div>
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                className="bg-white rounded-2xl"
                onValueChange={(values) => setLofiVolume(values[0])}
              />
            </div>
          </div>
          <div className="mt-4 text-xs text-center flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="size-2.5 rounded-full bg-green-400 animate-ping absolute" />
                <div className="size-2.5 rounded-full bg-green-400" />
              </div>
              SFO // LIVE
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
