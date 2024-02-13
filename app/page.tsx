'use client'
import {Tiptap} from "@/tiptap";

export default function Home() {
	return <div className="App container mx-auto px-16 flex flex-col gap-4 max-w-[100ch]">
		<main className="flex justify-start w-full">
			<Tiptap/>
		</main>
	</div>
}
