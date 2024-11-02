import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUser from "@/hooks/userUser";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { redirect } from "next/dist/server/api-utils";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const LogOut = async () => {
    await supabase.auth.signOut();
    redirect("/Signin");
  };
  const [user] = useUser();
  if (user == "no user") return <></>;

  return (
    <div className="w-full border border-b border-white/5 sticky top-0 bg-black z-50 bg-opacity-20 filter backdrop-blur-lg flex items-center justify-between px-6 py-3">
      {/*LOGO*/}
      <Logo size="sm" />
      <div className="flex space-x-7">
        {pathname !== "/dashboard" && (
          <div className="items-center flex space-x-4">
            <p className="text-white">Snippet</p>

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
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="text-white outline-none p-0 m-0 border-none">
            <div className="flex space-x-2 items-center justify-center hover:opacity-50">
              <p className="text-sm">
                {user && user?.user_metadata.full_name.split("")[0]}
              </p>
              <img
                alt="Name"
                className="h-8 w-8 rounded"
                src={user && user?.user_metadata.avatar_url}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0a0a0a]border-white/5 outline-none text-white bg-opacity-20 backdrop-blur-md filter">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>F
            <DropdownMenuSeparator className="bg-white/5" />
            <Link href="/settings" prefetch>
              <DropdownMenuItem className="text-white/70 smooth cursor-pointer rounded-md">
                APIs
              </DropdownMenuItem>
            </Link>
            <Link href="/settings" prefetch>
              <DropdownMenuItem className="text-white/70 smooth cursor-pointer rounded-md">
                Guides
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={LogOut}
              className="text-white/70 smooth cursor-pointer rounded-md"
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
