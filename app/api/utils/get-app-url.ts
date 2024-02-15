export default function getAppUrl() {
  return `${process.env.NEXT_PUBLIC_URL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}`
}