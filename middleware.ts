import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GithubAccessToken } from "./app/api/types";
import { decryptData } from "./app/api/utils/crypt";

export async function middleware(request: NextRequest) {
	try {
		const rawToken = cookies().get("token")?.value ?? "";
		const token: GithubAccessToken = JSON.parse(await decryptData(rawToken));
		console.log(token);
	} catch {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
}

export const config = {
	matcher: "/api/app/:path*",
};
