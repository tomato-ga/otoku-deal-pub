import '@/styles/globals.css'

import Head from 'next/head'

import { DefaultSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import GoogleTagManager from '@/components/GTM'

export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>激安特価セール速報</title>
				<meta
					name="description"
					content="アマゾンや楽天のセール情報をまとめています。節約・お得な買い物に役立てもらえれば嬉しいです"
				/>
			</Head>
			<GoogleTagManager />
			<DefaultSeo {...SEO} />
			<Component {...pageProps} />
		</>
	)
}
