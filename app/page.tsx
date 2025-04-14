import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      </div>
    </div>
  );
}
