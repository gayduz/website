import DefaultLayout from "@/components/layouts/DefaultLayout";

export default function IndexPage() {
	return (
		<DefaultLayout>
			<div className="App container mx-auto px-16 flex flex-col gap-4 max-w-[100ch]">
				<main className="flex justify-start w-full">dashboard</main>
			</div>
		</DefaultLayout>
	);
}
