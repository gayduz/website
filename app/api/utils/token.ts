import { cookies } from "next/headers";
import { GithubAccessToken } from "../types";
import { decryptData, encryptData } from "./crypt";

export async function getToken() {
	try {
		const rawToken = cookies().get("token")?.value ?? "";
		const token: GithubAccessToken = JSON.parse(await decryptData(rawToken));
		return token;
	} catch {
		return null;
	}
}

export async function setToken(token: GithubAccessToken) {
	const encryptedData = await encryptData(JSON.stringify(token));
	cookies().set("token", encryptedData);
}
