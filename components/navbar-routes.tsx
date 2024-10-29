"use client";

// import { UserButton } from '@clerk/nextjs';
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import SearchInput from "./search-input";
// import { isTeacher } from '@/lib/teacher';
import { ModeToggle } from "./mode-toggle";
import { LogOut } from "lucide-react";
import UserButton from "./user-button";
import { useSession } from "next-auth/react";
import { LOGIN_ROUTE } from "@/routes";

const NavbarRoutes = () => {
  // const { userId } = useAuth();
  const { data: session } = useSession();

  const pathname = usePathname();

  // const isTeacherPage = pathname?.startsWith('/teacher');
  // const isCoursePage = pathname?.includes('/courses');
  const isSearchPage = pathname?.startsWith("/search");

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto">
        <div className="pr-6">
          <ModeToggle />
        </div>

        {/* <Link href="/">
          <Button size={"sm"} variant={"ghost"}>
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link> */}
        <UserButton session={session} redirectTo={LOGIN_ROUTE} />
      </div>
    </>
  );
};

export default NavbarRoutes;
