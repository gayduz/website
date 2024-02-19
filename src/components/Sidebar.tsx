import { RouterOutputs, api } from "@/utils/api";
import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import _ from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserComponent: React.FC<{
	user: RouterOutputs["user"]["user"];
}> = ({ user }) => {
	return (
		<a
			href={`https://github.com/${user.login}`}
			className="flex gap-2 p-2 items-center"
			target="_blank"
			rel="noreferrer"
		>
			<Avatar className="rounded w-8 h-8">
				<AvatarImage src={user.avatar_url} />
				<AvatarFallback>
					{user.name
						? user.name
								.split(" ")
								.map((v) => v[0])
								.slice(0, 2)
								.join("")
						: user.login.slice(0, 2)}
				</AvatarFallback>
			</Avatar>
			<div className="text-xs truncate">@{user.login}</div>
		</a>
	);
};

const LoginComponent: React.FC = () => (
	<a
		href="/api/github/auth"
		className="flex gap-2 p-2 text-xs bg-white border m-2 rounded items-center"
	>
		<IconBrandGithub size={16} />
		Connect your account
	</a>
);

const RepoComponent: React.FC<{
	repos: RouterOutputs["user"]["connectedRepos"];
}> = ({ repos }) => {
	const groupedRepos = Object.entries(
		_.groupBy(repos, (repo) =>
			repo.full_name.split("/").slice(0, -1).join("/"),
		),
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="px-2 py-1">
					<Button variant="outline" className="w-full">
						Select repository
					</Button>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Connected repositories</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{groupedRepos.map(([organization, repos]) => (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>{organization}</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									{repos.map((repo) => (
										<DropdownMenuItem>{repo.name}</DropdownMenuItem>
									))}
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const Sidebar: React.FC = () => {
	const u = api.user.user.useQuery();
	const i = api.user.connectedRepos.useQuery();

	console.log(i.data);

	return (
		<div className="w-[240px] h-screen bg-zinc-100 border-r flex-shrink-0">
			{!u.isLoading && (
				<div>
					{u.data ? <UserComponent user={u.data} /> : <LoginComponent />}
				</div>
			)}
			<RepoComponent repos={i?.data ?? []} />
		</div>
	);
};

export default Sidebar;
