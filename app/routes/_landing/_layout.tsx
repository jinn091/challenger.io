import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import Header from "~/components/Header/Header";
import ThemeToggle from "~/components/Header/ThemeToggle";
import { Battle, Challenge, Class, LeaderBoard } from "~/components/icons";
import { getUserById, getUserId, UserInfo } from "~/model/user.server";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<UserInfo | null>> {
  const userId = await getUserId(request);

  if (!userId) {
    return json(null);
  }

  const user = await getUserById(userId);

  return json(user);
}

export default function GetIndex() {
  const user = useLoaderData<typeof loader>();

  return (
    <div>
      <Header user={user} />

      <div className="flex h-[calc(100vh-52px)] flex-1">
        <aside className="hidden md:flex w-72 shrink-0 flex-col overflow-y-auto border-rtext-xs font-normal leading-none bg-secondary-light dark:bg-secondary-dark border-r dark:border-gray-700">
          <nav className="mx-4 mt-6 flex flex-1 flex-col gap-0.5 text-gray-900 dark:text-white">
            <Link
              to="/"
              className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
            >
              <Battle width={20} height={20} className="dark:fill-white" />
              <p className="mt-1">Challenges</p>
            </Link>
            <Link
              to="/dictionary"
              className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
            >
              <LeaderBoard width={20} height={20} className="dark:fill-white" />
              <p>Leaderboard</p>
            </Link>
            <Link
              to="/"
              className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
            >
              <Class width={20} height={20} className="dark:fill-white" />
              <p>FAQ</p>
            </Link>

            {user && (
              <Link
                to="/add-challenge"
                className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
              >
                <Challenge width={20} height={20} className="dark:text-white" />
                <p>Create challenge</p>
              </Link>
            )}

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

            <ThemeToggle className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center justify-between" />

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

            {user === null && (
              <Link
                to={"/login"}
                className="dark:bg-blue-800 p-2 rounded bg-green-500"
              >
                <span>Log In</span>
              </Link>
            )}
          </nav>
        </aside>

        <aside className="flex md:hidden shrink-0 flex-col overflow-y-auto border-rtext-xs font-normal leading-none bg-secondary-light dark:bg-secondary-dark border-r dark:border-gray-700">
          <nav className="mx-2 mt-4 flex flex-1 flex-col gap-0.5 text-gray-900 dark:text-white">
            <Link
              to="/"
              className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
            >
              <Battle width={20} height={20} className="dark:fill-white" />
            </Link>
            <Link
              to="/dictionary"
              className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
            >
              <LeaderBoard width={20} height={20} className="dark:fill-white" />
            </Link>
            <Link
              to="/"
              className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
            >
              <Class width={20} height={20} className="dark:fill-white" />
            </Link>

            {user && (
              <Link
                to="/add-challenge"
                className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center"
              >
                <Challenge width={20} height={20} className="dark:text-white" />
              </Link>
            )}

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

            <ThemeToggle className="p-2 hover:bg-sky-100 dark:hover:bg-sky-900 text-sm rounded flex gap-1 items-center justify-between" />

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

            {user === null && (
              <Link
                to={"/login"}
                className="dark:bg-blue-800 p-2 rounded bg-green-500"
              >
                <span>Log In</span>
              </Link>
            )}
          </nav>
        </aside>

        <Outlet />
      </div>
    </div>
  );
}
