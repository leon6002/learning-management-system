import { db } from "@/lib/db";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CoursesList from "@/components/courses-list";
import { LOGIN_ROUTE } from "@/routes";

interface SearchPageProps {
  searchParams: Promise<{
    title: string;
    categoryId: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await auth();
  if (!session) {
    return redirect(LOGIN_ROUTE);
  }
  const userId = session?.user?.id;

  if (!userId) return redirect(LOGIN_ROUTE);

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const { title, categoryId } = await searchParams;

  const courses = await getCourses({
    userId,
    title,
    categoryId,
  });

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6 space-y-4">
        <Categories items={categories} />

        <CoursesList items={courses} size="sm" />
      </div>
    </>
  );
};

export default SearchPage;
