import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { authenticate } from "~/model/auth.server";
import { getUserById, UserInfo } from "~/model/user.server";
import { WebHackingMethods } from "~/utils/constant";

export async function loader({
	request
}: LoaderFunctionArgs): Promise<TypedResponse<UserInfo>> {
	const user = await authenticate(request, userId => getUserById(userId));

	return json(user);
}

export default function ProfileLayout(): React.JSX.Element {
	const {
		username,
		email,
		note,
		fbLink,
		gitHubLink,
		linkedInLink,
		teleLink,
		redditLink
	} = useLoaderData<typeof loader>();

	return (
		<div className="m-8 flex gap-8 w-full">
			<div className="flex flex-col gap-4 max-w-[400px]">
				<img
					className="w-[300px] h-[300px]"
					src="https://imgcdn.stablediffusionweb.com/2024/4/17/3b3ceb83-440b-4402-8461-00514a71c584.jpg"
					alt="profile-avatar"
				/>
				<div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

				<ul className="flex flex-col gap-5">
					<li>
						<h5 className="text-gray-600 dark:text-gray-400 font-bold">
							Achievements
						</h5>
					</li>
					<li className="flex flex-col">
						<h2 className="text-xl font-bold">
							Open Redirect Challenge
						</h2>
						<p className="text-[.9rem]">
							Target - <Link to={"."}>https://example.com</Link>
						</p>
						<p className="text-[.9rem]">Prize - 1000 MMK</p>
						<Link to={""} className="text-[.8rem] hover:underline">
							View details {">>"}
						</Link>
					</li>

					<li className="flex flex-col">
						<h2 className="text-xl font-bold">
							Server Side Execution Challenge
						</h2>
						<p className="text-[.9rem]">
							Target - <Link to={"."}>https://example.com</Link>
						</p>
						<p className="text-[.9rem]">Prize - 10000 MMK</p>
						<Link to={""} className="text-[.8rem] hover:underline">
							View details {">>"}
						</Link>
					</li>
				</ul>

				<div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

				<ul className="flex flex-col gap-5">
					<li>
						<h5 className="text-gray-600 dark:text-gray-400 font-bold">
							Skills
						</h5>
					</li>
					<div className="flex flex-wrap gap-1 sm:gap-2">
						{Object.keys(WebHackingMethods).map((wb, idx) =>
							idx < 9 ? (
								<small
									key={wb}
									className="dark:text-white bg-[#fafafa] dark:bg-primary-dark font-semibold text-xs rounded p-[.5rem] border"
								>
									{wb.replaceAll("_", "")}
								</small>
							) : null
						)}
					</div>
				</ul>
			</div>

			<div className="flex flex-col gap-4 flex-1">
				<div>
					<h1 className="text-xl font-bold">
						{username} - <small>{"< " + email + " />"}</small>
					</h1>
					<p>💻 Ethical Hacker</p>
					<small className="text-gray-500 dark:text-gray-300">
						{note}
					</small>
				</div>

				<div>
					<h2 className="text-xl font-bold">Ranking</h2>
					<small>#78758739</small>
				</div>

				<div>
					<h2 className="text-xl font-bold">Social Medias</h2>
					<div className="flex gap-2">
						{gitHubLink && (
							<Link
								target="_blank"
								rel="noreferrer"
								to={gitHubLink}
							>
								<img
									className="w-[2rem] h-[2rem]"
									src={`/images/social-icons/github.webp`}
									alt={"github"}
								/>
							</Link>
						)}
						{linkedInLink && (
							<Link
								target="_blank"
								rel="noreferrer"
								to={linkedInLink}
							>
								<img
									className="w-[2rem] h-[2rem]"
									src={`/images/social-icons/linkedin.webp`}
									alt={"linkedin"}
								/>
							</Link>
						)}
						{redditLink && (
							<Link
								target="_blank"
								rel="noreferrer"
								to={redditLink}
							>
								<img
									className="w-[2rem] h-[2rem]"
									src={`/images/social-icons/reddit.webp`}
									alt={"reddit"}
								/>
							</Link>
						)}
						{fbLink && (
							<Link target="_blank" rel="noreferrer" to={fbLink}>
								<img
									className="w-[2rem] h-[2rem]"
									src={`/images/social-icons/facebook.webp`}
									alt={"facebook"}
								/>
							</Link>
						)}
						{teleLink && (
							<Link
								target="_blank"
								rel="noreferrer"
								to={teleLink}
							>
								<img
									className="w-[2rem] h-[2rem]"
									src={`/images/social-icons/telegram.webp`}
									alt={"telegram"}
								/>
							</Link>
						)}
					</div>
				</div>

				<ul className="flex items-center gap-4 bg-[silver] dark:bg-secondary-dark rounded p-1">
					<NavLink
						className="p-2 hover:text-black rounded hover:bg-sky-400"
						to="/profile"
						end
					>
						Profile
					</NavLink>

					<NavLink
						className="p-2 hover:text-black rounded hover:bg-sky-400"
						to={"/profile/challenges"}
						end
					>
						Challenges
					</NavLink>

					<NavLink
						className="p-2 hover:text-black rounded hover:bg-sky-400"
						to={"/profile/achievements"}
						end
					>
						Achievements
					</NavLink>

					<NavLink
						className="p-2 hover:text-black rounded hover:bg-sky-400"
						to={"/"}
						end
					>
						Awards
					</NavLink>
				</ul>

				<Outlet />
			</div>
		</div>
	);
}
