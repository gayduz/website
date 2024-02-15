import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import querystring from 'node:querystring'
import { GithubAccessToken } from "../../types";
import { cryptr } from "../../utils/crypt";
import getAppUrl from "../../utils/get-app-url";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const res = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  })
  const rawData = querystring.decode(res.data)
  const data: GithubAccessToken = {
    access_token: rawData.access_token as string,
    expires_in: parseInt(rawData.expires_in as string),
    refresh_token: rawData.refresh_token as string,
    refresh_token_expires_in: parseInt(rawData.refresh_token_expires_in as string),
    scope: rawData.scope as string,
    token_type: rawData.token_type as string,
    given_at: new Date().getTime()
  }
  request.cookies.set('token', cryptr.encrypt(JSON.stringify(data)))
  return NextResponse.redirect(getAppUrl())
}