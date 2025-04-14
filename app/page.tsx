import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="rounded-lg border p-4">
        <h1 className="text-xl mb-4 text-center tracking-tight text-balance">
          Lofi ATC
        </h1>
        <div className="mb-4">
          <Select defaultValue="sfo-tower">
            <SelectTrigger className="w-full min-w-96">
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
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <div className="text-xs mb-2">ATC</div>
            <Slider
              defaultValue={[10]}
              max={100}
              step={1}
              className="bg-white rounded-2xl"
            />
          </div>
          <div className="flex-1">
            <div className="text-xs mb-2">LOFI</div>
            <Slider
              defaultValue={[10]}
              max={100}
              step={1}
              className="bg-white rounded-2xl"
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
  );
}
