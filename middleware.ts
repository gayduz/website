import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "./app/api/utils/token";

export async function middleware(request: NextRequest) {
	const token = await getToken();
	if (token == null) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	console.log(token);
}

export const config = {
	matcher: "/api/app/:path*",
};
