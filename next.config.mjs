/** @type {import('next').NextConfig} */
export default {
	reactStrictMode: true,
	experimental: {
		// mdxRs: true,
		typedRoutes: true,
	},
	async redirects() {
		return [
			{
				source: "/what-i-use",
				destination: "/uses",
				permanent: true,
			},
			{
				source: "/tools",
				destination: "/uses",
				permanent: true,
			},
			{
				source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:post",
				destination: "/blog/:post",
				permanent: true,
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/resume",
				destination: "/",
			},
			{
				source: "/feed.xml",
				destination: "/feed",
			},
		];
	},
};
