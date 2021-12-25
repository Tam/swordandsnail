import { gql } from 'urql';
import Title from '../components/Title';
import { parse } from 'marked';
import createClient from '../lib/client';
import Prose from '../components/Prose';

export default function Page ({ title, text }) {
	return (
		<>
			<Title>{title}</Title>
			<Prose>{text}</Prose>
		</>
	);
}

export async function getStaticProps ({ params: { slug } }) {
	const client = createClient();

	const { data } = await client.query(gql`
		query GetPage ($slug: String!) {
			pageFromSlug (slug: $slug) {
				id
				title
				text
			}
		}
	`, { slug }).toPromise();

	const page = data?.pageFromSlug;

	if (!page)
		return { notFound: true };

	return {
		props: {
			title: page.title,
			text: parse(page.text)
		},
		revalidate: 10,
	};
}

export async function getStaticPaths () {
	const client = createClient();

	const { data } = await client.query(gql`
		query GetPages {
			pagesList {
				slug
			}
		}
	`).toPromise();

	return {
		paths: data.pagesList.map(page => ({ params: { slug: page.slug } })),
		fallback: 'blocking',
	}
}
