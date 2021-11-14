import Head from 'next/head';

export default function Title ({ children }) {
	if (Array.isArray(children))
		children = children.join('');

	return (
		<Head>
			<title>{children} - Sword & Snail</title>
		</Head>
	);
}
