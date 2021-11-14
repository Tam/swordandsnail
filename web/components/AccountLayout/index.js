import css from './style.module.scss';
import Title from '../Title';
import A from '../A';
import { useRouter } from 'next/router';

const NavLink = ({ href, children }) => {
	const active = useRouter().pathname.endsWith(href || 'account');

	return (
		<li><A href={`/account/${href}`}>{active ? '> ' : ''}{children}</A></li>
	);
};

export default function AccountLayout ({ title, children }) {
	return (
		<div className={css.wrap}>
			<Title>Account / {title}</Title>
			<aside className={css.aside}>
				<ul>
					<NavLink href="">Profile</NavLink>
					<NavLink href="security">Security</NavLink>
					<NavLink href="preferences">Preferences</NavLink>
					<NavLink href="data">My Data</NavLink>
					<NavLink href="danger">Danger Zone</NavLink>
				</ul>
			</aside>
			<section className={css.content}>
				{children}
			</section>
		</div>
	);
}
