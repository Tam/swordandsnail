import '../styles/globals.scss';
import Head from 'next/head';
import Header from '../components/Header';
import PreferencesHook from '../components/PreferencesHook';
import Footer from '../components/Footer';
import App from 'next/app';
import SessionContext from '../contexts/SessionContext';
import { useState } from 'react';
import withSsr from '../hoc/withSsr';

if (!String.prototype.replaceAll)
	String.prototype.replaceAll = function (find, replace) {
		return this.replace(new RegExp(find, 'g'), replace);
	};

function MyApp ({ Component, pageProps, isLoggedIn }) {
	const [session, setSession] = useState({ isLoggedIn });

	return (
		<SessionContext.Provider value={[session, setSession]}>
			<PreferencesHook />
			<Head>
				{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && <meta name="robots" content="noindex" />}
				<title>Sword & Snail</title>
				<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐌</text></svg>" />
			</Head>
			{session.isLoggedIn && <Header />}
			<main><Component {...pageProps} /></main>
			<Footer />
		</SessionContext.Provider>
	);
}

MyApp.getInitialProps = async ctx => {
	const props = await App.getInitialProps(ctx);

	// TODO: Having a session token != logged in
	if (!process.browser)
		props.isLoggedIn = !!ctx?.ctx?.req?.cookies?.['snails.satchel'];

	return props;
};

export default withSsr(MyApp);
