"use client";

import { signOut, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Loader2Icon, LogOutIcon, UserIcon, UserRoundPen } from "lucide-react";
import { toast } from "sonner";

const AuthButton = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  // console.log("session", session);

  return (
    <>
      {isPending ? (
        <div className="flex w-full justify-center items-center">
          <Loader2Icon className="w-5 h-5 animate-spin" />
        </div>
      ) : user ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="focus-visible:outline-none cursor-pointer">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.image ?? ""} alt="user" />
              <AvatarFallback>
                <span className="text-amber-400 font-semibold">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </span>
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 p-2" align="end">
            {/* profiles */}
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
            >
              <UserRoundPen className="mr-2 w-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
              <span className="">Profile</span>
            </DropdownMenuItem>

            {/* admin */}
            {user && user.role === "ADMIN" && (
              <DropdownMenuItem
                onClick={() => router.push("/admin")}
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
              >
                <UserIcon className="mr-2 w-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                <span className="">Admin</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* logout */}
            <DropdownMenuItem
              className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
              onClick={() =>
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/auth/login");
                      toast.success("Logout successful");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => router.push("/auth/login")}>Login</Button>
      )}
    </>
  );
};

export default AuthButton;
