// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://www.otoku-deal.com',
	generateRobotsTxt: true,
	exclude: ['/server-sitemap-index.xml'], // <= exclude here
	robotsTxtOptions: {
		additionalSitemaps: [
			'https://www.otoku-deal.com/server-sitemap-index.xml' // <==== Add here
		]
	}
}
