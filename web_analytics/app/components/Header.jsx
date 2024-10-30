import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full border border-b border-white/5 sticky top-0 bg-black z-50 bg-opacity-20 filter backdrop-blur-lg">
      {/*LOGO*/}
      <div className="flex space-x-7">
        <div className="items-center flex space-x-4">
          <p className="">Snippet</p>
          <Link
            prefetch
            href={"/dashboard"}
            className="flex items-center justify-center space-x-2 group"
          >
            <button className="text-sm text-white/60 group-hover:text-white smooth">
              Dashboard
            </button>
            <ArrowRightIcon className="h-4 w-4 stroke-white/60 group-hover:stroke-white smooth" />
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-white outline-none p-0 m-0 border-none">
            <div className="flex space-x-2 items-center justify-center hover:opacity-50">

            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent></DropdownMenuContent>

        </DropdownMenu>
      </div>
    </div>
  );
}
