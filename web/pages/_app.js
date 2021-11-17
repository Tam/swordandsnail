import '../styles/globals.scss';
import useCreateClient from '../hooks/useCreateClient';
import Head from 'next/head';
import { Provider } from 'urql';
import { SessionData } from '../lib/client';
import Header from '../components/Header';
import PreferencesHook from '../components/PreferencesHook';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';

function MyApp ({ Component, pageProps }) {
	const router = useRouter();
	const [client, preventRenderDuringRedirect] = useCreateClient({
		defaultPostLoginRedirect: '/games',
		unprotectedRoutes: ['/signin', '/forgot', '/reset', '/signup'],
		agnosticRoutes: ['/', '/400', '/500', '/_error'],
	});

	const head = (
		<Head>
			{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && <meta name="robots" content="noindex" />}
			<title>Sword & Snail</title>
			<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐌</text></svg>" />
		</Head>
	);

	if (preventRenderDuringRedirect)
		return head;

	return (
		<Provider value={client}>
			<PreferencesHook />
			{head}
			{SessionData.isLoggedIn && router.pathname !== '/' && <Header />}
			<main><Component {...pageProps} /></main>
			<Footer />
		</Provider>
	);
}

export default MyApp;
