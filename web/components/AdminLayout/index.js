import css from '../AccountLayout/style.module.scss';
import { useRouter } from 'next/router';
import A from '../A';
import Title from '../Title';

const NavLink = ({ href, children }) => {
	const active = useRouter().pathname.endsWith(href || 'admin');

	return (
		<li><A href={`/admin/${href}`}>{active ? '> ' : ''}{children}</A></li>
	);
};

export default function AdminLayout ({ title, children, actions = null }) {
	return (
		<div className={css.wrap}>
			<Title>Admin / {title}</Title>
			<aside className={css.aside}>
				<ul>
					<NavLink href="">Dashboard</NavLink>
					<NavLink href="users">Users</NavLink>
					<NavLink href="pages">Pages</NavLink>
				</ul>
				{actions}
			</aside>
			<section className={css.content}>
				{children}
			</section>
		</div>
	);
}
