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
import { useParams } from "next/navigation";
import React from "react";
import { IconFolder, IconFile } from "@tabler/icons-react";

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

const FileTreeComponent: React.FC<{ tree: FileTree }> = ({ tree }) =>
	Object.entries(tree).map(([key, { value, children }]) =>
		value.type === "blob" ? (
			<div key={value.path}>
				<Button size="sm" className="w-full justify-start" variant="outline">
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
							<FileTreeComponent tree={children} />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		),
	);

const FileExplorerComponent: React.FC<{
	files: NonNullable<RouterOutputs["user"]["getRepo"]["files"]>["tree"];
}> = ({ files }) => {
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
					<FileTreeComponent tree={data} />
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

	console.log(name);

	const repo = api.user.getRepo.useQuery({ name });
	console.log("repo", repo.data);

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
						<FileExplorerComponent files={repo.data.files?.tree ?? []} />
					)}
				</div>
			}
		>
			e
		</DefaultLayout>
	);
};

export default RepositoryPage;
