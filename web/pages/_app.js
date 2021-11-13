import '../styles/globals.scss';
import useCreateClient from '../hooks/useCreateClient';
import Head from 'next/head';
import { Provider } from 'urql';

function MyApp ({ Component, pageProps }) {
	const [client, preventRenderDuringRedirect] = useCreateClient({
		defaultPostLoginRedirect: '/games',
		unprotectedRoutes: ['/', '/forgot', '/reset'],
		agnosticRoutes: ['/400', '/500', '/error'],
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
			{head}
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
