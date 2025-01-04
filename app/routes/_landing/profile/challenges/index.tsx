import { useRouteLoaderData } from "@remix-run/react";
import React, { useEffect } from "react";
import { loader as profileRootLoader } from "../_layout";
import { Profile } from "~/components/icons";

export default function ProfileRoute(): React.JSX.Element {
  const data = useRouteLoaderData<typeof profileRootLoader>(
    "routes/_landing/profile/_layout"
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-xl">Challenges</h1>
    </div>
  );
}
