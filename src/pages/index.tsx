import DefaultLayout from "@/components/layouts/DefaultLayout";
import dynamic from "next/dynamic";

const Tiptap = dynamic(async () => (await import("@/tiptap")).Tiptap);

export default function Home() {
	return (
		<DefaultLayout>
			<div className="App container mx-auto px-16 flex flex-col gap-4 max-w-[100ch]">
				<main className="flex justify-start w-full">{/* <Tiptap /> */}</main>
			</div>
		</DefaultLayout>
	);
	// return (
	//   <>
	//     <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
	//       <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
	//         <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
	//           Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
	//         </h1>
	//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
	//           <Link
	//             className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
	//             href="https://create.t3.gg/en/usage/first-steps"
	//             target="_blank"
	//           >
	//             <h3 className="text-2xl font-bold">First Steps →</h3>
	//             <div className="text-lg">
	//               Just the basics - Everything you need to know to set up your
	//               database and authentication.
	//             </div>
	//           </Link>
	//           <Link
	//             className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
	//             href="https://create.t3.gg/en/introduction"
	//             target="_blank"
	//           >
	//             <h3 className="text-2xl font-bold">Documentation →</h3>
	//             <div className="text-lg">
	//               Learn more about Create T3 App, the libraries it uses, and how
	//               to deploy it.
	//             </div>
	//           </Link>
	//         </div>
	//         <p className="text-2xl text-white">
	//           {hello.data ? hello.data.greeting : "Loading tRPC query..."}
	//         </p>
	//       </div>
	//     </main>
	//   </>
	// );
}
