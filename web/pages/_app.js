import '../styles/globals.scss';
import useCreateClient from '../hooks/useCreateClient';
import Head from 'next/head';
import { Provider } from 'urql';

function MyApp ({ Component, pageProps }) {
	const [client, preventRenderDuringRedirect] = useCreateClient({
		agnosticRoutes: ['/400', '/500', '/'],
	});

	const head = (
		<Head>
			{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && <meta name="robots" content="noindex" />}
			<title>Sword & Snail</title>
			{/*<link rel="icon" type="image/svg+xml" href="/favicon.svg" />*/}
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
