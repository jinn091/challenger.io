import { Form, useRouteLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { loader as profileRootLoader } from "../_layout";
import { WebHackingMethods } from "~/utils/constant";
import { formatHackingMethod } from "~/utils/challenge";

export default function ProfileRoute(): React.JSX.Element {
	const data = useRouteLoaderData<typeof profileRootLoader>(
		"routes/_landing/profile/_layout"
	);
	const [noteCount, setNoteCount] = useState<number>(data?.note?.length ?? 0);
	const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
	const [availableMethods, setAvailableMethods] = useState(
		Object.keys(WebHackingMethods)
	);

	// Handle method click: Add to selected
	const handleMethodClick = (method: string) => {
		setAvailableMethods(prev => prev.filter(item => item !== method));
		setSelectedMethods(prev => [...prev, method]);
	};

	// Handle selected method click: Remove from selected
	const handleRemoveMethod = (method: string) => {
		setSelectedMethods(prev => prev.filter(item => item !== method));
		setAvailableMethods(prev => [...prev, method]);
	};

	return (
		<Form method="POST" className="flex flex-col gap-4">
			<h1 className="font-bold text-xl">Challenges</h1>

			<div className="flex gap-20">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col dark:text-white">
						<label className="dark:text-white" htmlFor="name-input">
							Challenge Name
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px] dark:text-white">
							<input
								id="name-input"
								type="text"
								name="name"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={""}
								placeholder="Name"
								required
							/>
						</div>
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="target-input"
						>
							Target Link
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px] dark:text-white">
							<input
								id="target-input"
								type="text"
								name="target"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={""}
								placeholder="Target Link"
								required
							/>
						</div>
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="prize-input"
						>
							Prize
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start max-w-[180px] dark:text-white">
							<input
								id="prize-input"
								type="number"
								name="prize"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={""}
								placeholder="Prize"
								required
								min={0}
							/>
							<strong className="mx-2 text-[#706525]">MMK</strong>
						</div>
						<small>0 - 1,000,000 MMK</small>
					</div>

					<div className="flex flex-col dark:text-white">
						<label className="dark:text-white" htmlFor="note-input">
							Note
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<textarea
								id="note-input"
								name="note"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white resize-none overflow-y-auto"
								rows={5}
								style={{ lineHeight: "1.25rem" }}
								maxLength={300}
								onChange={e =>
									setNoteCount(e.currentTarget.value.length)
								}
								defaultValue={data?.note ?? ""}
								placeholder="Note"
							/>
						</div>
						<small className="text-gray-500">{noteCount}/300</small>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					{/* Available Methods */}
					<h3>Available Methods</h3>
					<div className=" bg-[#cfcece] dark:bg-secondary-dark min-w-[350px] rounded p-4 max-h-[200px] overflow-auto">
						<ul className="flex gap-2 flex-wrap">
							{availableMethods.map(method => (
								<li
									key={method}
									onClick={() => handleMethodClick(method)}
									className="text-[11px] font-bold border border-gray-600 p-2 rounded cursor-pointer"
								>
									{formatHackingMethod(method)}
								</li>
							))}
						</ul>
					</div>
					{/* Selected Methods */}
					<h3>Selected Methods</h3>
					<div className=" bg-[#cfcece] dark:bg-secondary-dark min-w-[350px] rounded p-4 max-h-[200px] overflow-auto">
						<ul className="flex gap-2 flex-wrap">
							{selectedMethods.length !== 0 ? (
								selectedMethods.map(method => (
									<li
										key={method}
										onClick={() =>
											handleRemoveMethod(method)
										}
										className="text-[11px] font-bold border border-gray-600 p-2 rounded cursor-pointer selected"
									>
										{formatHackingMethod(method)}
									</li>
								))
							) : (
								<p>Please select hacking methods.</p>
							)}
						</ul>
					</div>{" "}
				</div>
			</div>

			<button className="bg-green-500 dark:bg-blue-900 p-2 rounded self-start">
				<span>Create Challenge</span>
			</button>
		</Form>
	);
}
