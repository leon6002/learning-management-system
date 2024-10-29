"user client";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { HOME_ROUTE, TEACHER_ROUTE } from "@/routes";
import { isTeacher } from "@/lib/teacher";

type UserButtonProps = {
  session: Session | null;
  redirectTo: string;
};

const UserButton = ({ session, redirectTo }: UserButtonProps) => {
  const router = useRouter();
  if (!session) {
    return <Button onClick={() => router.push("login")}>登录</Button>;
  }
  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="aspect-square h-8 w-8 rounded-full bg-slate-400 dark:bg-slate-900">
          <Avatar className="relative h-8 w-8">
            {user.image ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  fill
                  src={user.image}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{user.name}</span>
                <User className="h-4 w-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-neutral-50 dark:bg-neutral-950"
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {user.image && (
              <p className="text-sm font-medium text-primary">{user.name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-xs text-primary">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={HOME_ROUTE} className="cursor-pointer pl-5">
            首页
          </Link>
        </DropdownMenuItem>

        {isTeacher(session) && (
          <DropdownMenuItem asChild>
            <Link href={TEACHER_ROUTE} className="cursor-pointer pl-5">
              教师后台
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          {/* <form
            action={async () => {
              "use server";
              await signOut({ redirectTo });
            }}
          > */}
          <Button
            variant={"ghost"}
            className="flex"
            onClick={() => signOut({ redirectTo })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
          {/* </form> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
