import DefaultLayout from "@/components/layouts/DefaultLayout";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouterOutputs, api } from "@/utils/api";
import _ from "lodash";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { IconFolder, IconFile } from "@tabler/icons-react";

import dynamic from "next/dynamic";
const Tiptap = dynamic(async () => (await import("@/tiptap")).Tiptap);

const BranchesComponent: React.FC<{
	selectedBranchName?: string;
	branches: RouterOutputs["user"]["getRepo"]["branches"];
}> = ({ branches, selectedBranchName }) => {
	const selectedBranch = branches.find(
		(branch) => branch.name === selectedBranchName,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="w-full" asChild>
				<Button className="w-full" variant="outline">
					<div className="truncate">
						{selectedBranch ? selectedBranch.name : "Select Branch"}
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Branches</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{branches.map((branch) => (
					<DropdownMenuCheckboxItem
						key={branch.name}
						checked={selectedBranch?.name === branch.name}
					>
						{branch.name}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

type FileTree = Record<
	string,
	{
		value: NonNullable<
			RouterOutputs["user"]["getRepo"]["files"]
		>["tree"][number];
		children: FileTree;
	}
>;

const FileTreeComponent: React.FC<{
	tree: FileTree;
	onClick(path: string): void;
}> = ({ tree, onClick }) =>
	Object.entries(tree).map(([key, { value, children }]) =>
		value.type === "blob" ? (
			<div key={value.path}>
				<Button
					size="sm"
					className="w-full justify-start"
					variant="outline"
					onClick={() => onClick(value.path!)}
				>
					<IconFile size={16} className="mr-2 text-blue-600" />
					{value.path?.split("/").slice(-1)}
				</Button>
			</div>
		) : (
			<Accordion type="single" collapsible key={value.path}>
				<AccordionItem value={value.path!} className="border-0">
					<AccordionTrigger className="py-0">
						<Button
							size="sm"
							className="w-full justify-start mr-2"
							variant="outline"
						>
							<IconFolder size={16} className="mr-2 text-yellow-700" />
							{key}
						</Button>
					</AccordionTrigger>
					<AccordionContent className="py-0">
						<div className="flex flex-col gap-2 pl-4 pt-2">
							<FileTreeComponent tree={children} onClick={onClick} />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		),
	);

const FileExplorerComponent: React.FC<{
	files: NonNullable<RouterOutputs["user"]["getRepo"]["files"]>["tree"];
	onClick(path: string): void;
}> = ({ files, onClick }) => {
	const data = files
		.filter((f) => typeof f.path === "string")
		.reduce((o, f) => {
			const key1 = (f.path ?? "").split("/");
			const key2 = _.flatten(
				_.zip(key1, _.fill(new Array(key1.length), "children")),
			).slice(0, -1) as string[];
			return _.setWith(o, key2, { value: f, children: {} });
		}, {}) as FileTree;
	console.log(data);
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" className="w-full mt-3">
					Select file
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="flex flex-col gap-2 p-8">
					<FileTreeComponent tree={data} onClick={onClick} />
				</div>
			</DrawerContent>
		</Drawer>
	);
};

const RepositoryPage: React.FC = () => {
	const params = useParams<{
		name: string | string[];
	}>();
	const name = Array.isArray(params?.name)
		? params.name.join("/")
		: params?.name ?? "";

	const repoName = name.split("/").slice(0, 2).join("/");
	const branchName = name.split("/").slice(2, 3).join("/");
	const fileName = name.split("/").slice(3).join("/");

	console.log(name, repoName);

	const repo = api.user.getRepo.useQuery({ name: repoName });
	const file = api.user.getFile.useQuery({
		path: fileName,
		repo: repoName,
		branch: branchName,
	});

	console.log("repo", repo.data);
	console.log("file", file.data);

	const router = useRouter();

	return (
		<DefaultLayout
			sidebarChildren={
				<div className="p-2 w-full">
					{repo.data && (
						<BranchesComponent
							branches={repo.data.branches}
							selectedBranchName={repo.data.branch?.name}
						/>
					)}

					{repo.data && (
						<FileExplorerComponent
							files={repo.data.files?.tree ?? []}
							onClick={(path: string) =>
								router.push(`/r/${repoName}/${repo.data.branch?.name}/${path}`)
							}
						/>
					)}
				</div>
			}
		>
			<Tiptap content={file.data?.content} />
		</DefaultLayout>
	);
};

export default RepositoryPage;
