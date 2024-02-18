import { RouterOutputs, api } from "@/utils/api";
import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";

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
			<img src={user.avatar_url} alt={user.login} className="w-8 rounded" />
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
	repo: RouterOutputs["user"]["connectedRepos"][number];
}> = ({ repo }) => (
	<a
		href={`https://github.com/${repo.full_name}`}
		target="_blank"
		rel="noreferrer"
		className="flex gap-2 p-2 text-xs bg-white border rounded items-center"
	>
		{repo.full_name}
	</a>
);

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
			{!i.isLoading && (
				<div className="flex flex-col px-2 mt-2 gap-1">
					{i.data!.map((repo) => (
						<RepoComponent repo={repo} />
					))}
				</div>
			)}
		</div>
	);
};

export default Sidebar;
