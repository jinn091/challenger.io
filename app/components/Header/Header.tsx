import { SerializeFrom } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { UserInfo } from "~/model/user.server";

export default function Header({
	user
}: {
	user: SerializeFrom<UserInfo> | null;
}): JSX.Element {
	return (
		<nav className="menu flex justify-between p-2 items-center">
			<Link
				to="/"
				className="flex items-center text-xl font-sans active:scale-95 transition-all gap-1"
			>
				<img src="/images/learnio.png" alt="logo" width="40px" />
				<h1 className=" bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
					Challenger.io
				</h1>
			</Link>

			{user === null ? (
				<div className="flex gap-2">
					<Link to="/login" className="button bg-[green]">
						<p>Log In</p>
					</Link>
					<Link to="/register" className="button bg-[blue]">
						<p>Register</p>
					</Link>
				</div>
			) : (
				<div className="flex gap-1 items-center mx-4">
					<div className="flex flex-wrap gap-2">
						<span className="font-bold text-md">Welcome, </span>
						<span className="hover:underline">
							<Link to={"/profile"}>{user.username}</Link>
						</span>
					</div>
					<Form action="/logout" method="post">
						<button className="p-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded">
							<div className="bg-primary-light dark:bg-primary-dark rounded p-1 px-2 flex flex-col justify-center">
								<span className="text-sm">Logout</span>
							</div>
						</button>
					</Form>
				</div>
			)}
		</nav>
	);
}
