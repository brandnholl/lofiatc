"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { lofiTracks } from "@/data/lofi";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [atcVolume, setAtcVolume] = useState(0);
  const [lofiVolume, setLofiVolume] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentLofiIndex, setCurrentLofiIndex] = useState(() =>
    Math.floor(Math.random() * lofiTracks.length)
  );
  const atcAudioRef = useRef<HTMLAudioElement>(null);
  const lofiAudioRef = useRef<HTMLAudioElement>(null);

  const atcAudioUrl = useRef<string | null>(null);

  const currentLofiUrl = lofiTracks[currentLofiIndex].url;

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      return /android|iPad|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    };

    const isMobileDevice = checkMobile();
    setIsMobile(isMobileDevice);
    
    if (!isMobileDevice) {
      atcAudioUrl.current = `/api/atc-proxy?station=ksfo_twr&nocache=${Date.now()}`;
    }
  }, []);

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
      atcAudio.muted = true;
    }

    return () => {};
  }, [atcVolume, userInteracted]);

  useEffect(() => {
    const lofiAudio = lofiAudioRef.current;
    if (!lofiAudio || !userInteracted) return;

    const handleTrackEnded = () => {
      setCurrentLofiIndex((prevIndex) => (prevIndex + 1) % lofiTracks.length);
    };

    lofiAudio.addEventListener("ended", handleTrackEnded);

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
      lofiAudio.removeEventListener("ended", handleTrackEnded);
      lofiAudio.pause();
    };
  }, [lofiVolume, userInteracted, currentLofiIndex]);

  if (isMobile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden">
        <div className="rounded-lg border p-5 w-full max-w-md text-center mx-4">
          <h1 className="text-xl mb-4 font-medium">Lofi ATC</h1>
          <div className="mb-2">
            <div className="relative mx-auto w-16 h-16 mb-3">
              <div className="size-16 rounded-full bg-red-400 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🔇</span>
              </div>
            </div>
            <p className="text-sm mb-3">
              Lofi ATC does not work on mobile devices due to
              the limitations of mobile browser APIs.
            </p>
            <p className="text-sm">
              Please open this site on a computer to enjoy the full
              experience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {atcAudioUrl.current && (
        <audio
          ref={atcAudioRef}
          src={atcAudioUrl.current}
          muted
          suppressHydrationWarning
        />
      )}
      <audio
        ref={lofiAudioRef}
        src={currentLofiUrl}
        muted
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
