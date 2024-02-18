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
		>
			<img src={user.avatar_url} alt={user.login} className="w-6 rounded" />
			<code className="text-xs truncate">@{user.login}</code>
		</a>
	);
};

const LoginComponent: React.FC = () => (
	<a
		href="/api/github/auth"
		className="flex gap-2 p-2 bg-white border m-2 rounded"
	>
		<IconBrandGithub />
		Connect your account
	</a>
);

const Sidebar: React.FC = () => {
	const { data, isLoading } = api.user.user.useQuery();
	api.github.callback.useQuery({ code: "123" });

	return (
		<div className="w-[240px] h-screen bg-zinc-100 border-r flex-shrink-0">
			{!isLoading && data ? <UserComponent user={data} /> : <LoginComponent />}
		</div>
	);
};

export default Sidebar;
