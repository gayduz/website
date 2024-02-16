import { NextResponse } from "next/server";
import { Octokit } from "octokit";
import { App } from "octokit";
import { GithubAccessToken } from "../types";
import { getToken } from "../utils/token";

const app = new App({
	appId: process.env.GITHUB_APP_ID as string,
	privateKey: process.env.GITHUB_PRIVATE_KEY as string,
});

const octokit = new Octokit({ auth: process.env.GITHUB_BOT_PERSONAL_TOKEN });

const repoConfig = {
	owner: "gayduz",
	repo: "botexperiments",
};

async function getSHA(path: string) {
	try {
		const { data } = await octokit.rest.repos.getContent({
			...repoConfig,
			path,
		});

		if (Array.isArray(data)) {
			return undefined;
		}

		return data.sha;
	} catch {
		return undefined;
	}
}

export async function GET() {
	const token = (await getToken()) as GithubAccessToken;

	if (token.installation_ids.length === 0) {
		return NextResponse.json(
			{ message: "You don't have an installed app" },
			{ status: 400 },
		);
	}

	const repos = [];

	await app.eachRepository((a) => {
		repos.push(a);
	});
	// const installation = await app.getInstallationOctokit(token.installation_ids[0])
	// console.log(await installation.rest.repos.listForUser({
	// 	username
	// }))
	// const { data: repo } = await octokit.rest.repos.get(repoConfig);
	// const { data: branch } = await octokit.rest.repos.getBranch({
	// 	...repoConfig,
	// 	branch: "main",
	// });
	// const r = await octokit.rest.repos.createOrUpdateFileContents({
	// 	...repoConfig,
	// 	path: "test2",
	// 	message: "Adding a shitt",
	// 	content: Buffer.from("i am file content?").toString("base64"),
	// 	sha: await getSHA("test2"),
	// });
	// console.log("finished");
	// // console.log('herererer', process.env.GITHUB_BOT_PERSONAL_TOKEN)
	// return NextResponse.json(r.data);
	return NextResponse.json(repos);
}
