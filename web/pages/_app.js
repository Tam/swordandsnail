import '../styles/globals.scss';
import useCreateClient from '../hooks/useCreateClient';
import Head from 'next/head';
import { Provider } from 'urql';
import { SessionData } from '../lib/client';
import Header from '../components/Header';
import PreferencesHook from '../components/PreferencesHook';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import App from 'next/app';

if (!String.prototype.replaceAll)
	String.prototype.replaceAll = function (find, replace) {
		return this.replace(new RegExp(find, 'g'), replace);
	};

function MyApp ({ Component, pageProps }) {
	const router = useRouter()
		, client = useCreateClient();

	return (
		<Provider value={client}>
			<PreferencesHook />
			<Head>
				{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && <meta name="robots" content="noindex" />}
				<title>Sword & Snail</title>
				<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐌</text></svg>" />
			</Head>
			{SessionData.isLoggedIn && router.pathname !== '/' && <Header />}
			<main><Component {...pageProps} /></main>
			<Footer />
		</Provider>
	);
}

MyApp.getInitialProps = async ctx => {
	if (!process.browser)
		SessionData.isLoggedIn = !!ctx?.ctx?.req?.cookies?.['snail.ssrid'];

	return await App.getInitialProps(ctx);
};

export default MyApp;
