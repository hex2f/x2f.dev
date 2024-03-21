import { getCachedPost, getCachedPostList } from "@/lib/content";
import { Feed } from "feed";
import { Fragment } from "react";
import { StaticMarkdown } from "@/components/Markdown";
import { convert } from "@/lib/unified";
import { getSlug } from "@/lib/slug";

export async function GET() {
	const { renderToStaticMarkup } = await import("react-dom/server");

	const posts = getCachedPostList();

	const feed = new Feed({
		title: "Leah Lundqvist's Blog",
		description: "My personal sliver of the web",
		id: "https://x2f.dev/",
		link: "https://x2f.dev",
		// image: "http://example.com/image.png",
		// favicon: "http://example.com/favicon.ico",
		copyright: `All rights reserved ${new Date().getFullYear()}, Leah Lundqvist`,
		generator: "Feed for Node.js",
		// feedLinks: {
		// 	json: "https://example.com/json",
		// 	atom: "https://example.com/atom",
		// },
		author: {
			name: "Leah Lundqvist",
			email: "leah@pigeon.sh",
			link: "https://x2f.dev",
		},
	});

	let lastUpdated = undefined;

	for (const post of posts) {
		const slug = getSlug(post);
		const { frontmatter, content } = await getCachedPost(slug);
		const publishDate = new Date(frontmatter.date);

		if (lastUpdated == null || lastUpdated < publishDate) {
			lastUpdated = publishDate;
		}

		const tree = await convert(content);

		feed.addItem({
			title: frontmatter.title,
			id: `https://x2f.dev/blog/${slug}`,
			link: `https://x2f.dev/blog/${slug}`,
			content: renderToStaticMarkup(
				<Fragment>
					<StaticMarkdown tree={tree}>{content}</StaticMarkdown>
					<a
						href={`mailto:leah@pigeon.sh?subject=Reply%20to:%20“${frontmatter.title}”`}
					>
						Reply via e-mail
					</a>
				</Fragment>,
			),
			date: publishDate,
			// image: post.image,
		});
	}

	feed.options.updated = lastUpdated;

	const rss = feed.rss2();

	return new Response(rss, {
		headers: {
			"Content-Type": "application/atom+xml",
		},
	});
}
