import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/model/auth.server";
import { getUserById, UserInfo } from "~/model/user.server";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<UserInfo>> {
  const user = await authenticate(request, (userId) => getUserById(userId));

  return json(user);
}

export default function AddChallengeLayout(): React.JSX.Element {
  const { username } = useLoaderData<typeof loader>();

  return (
    <div className="m-5">
      <h1>Welcome to Challenge Page. {username}</h1>
    </div>
  );
}
