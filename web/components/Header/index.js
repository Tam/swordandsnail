import css from './style.module.scss';
import A from '../A';
import { useEffect, useRef, useState } from 'react';
import Button from '../Button';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from 'urql';
import { SessionData } from '../../lib/client';

export default function Header () {
	const router = useRouter();
	const menu = useRef();
	const [menuOpen, setMenuOpen] = useState(false);

	const [{ data }] = useQuery({
		query: gql`
			query ViewerRole {
				viewer { account { role } }
			}
		`
	});

	const [, logout] = useMutation(gql`
        mutation Logout {
            logout
        }
	`);

	useEffect(() => {
		if (!menuOpen || !menu.current) return;

		const onBodyClick = e => {
			setMenuOpen(
				e.target === menu.current
				|| menu.current?.contains(e.target)
			);
		};

		const onRouteChange = () => setMenuOpen(false);

		router.events.on('routeChangeStart', onRouteChange);
		document.addEventListener('click', onBodyClick);

		return () => {
			router.events.off('routeChangeStart', onRouteChange);
			document.removeEventListener('click', onBodyClick);
		};
	}, [menuOpen, menu.current]);

	const onToggleMenuClick = () => setMenuOpen(o => !o);

	const onLogoutClick = async () => {
		SessionData.isLoggedIn = false;
		await logout();
		await router.push('/');
	};

	const viewer = data?.viewer;
	const isAdmin = viewer?.account?.role?.toLowerCase() === 'admin';
	const isDesigner = viewer?.account?.role?.toLowerCase() === 'designer' || isAdmin;

	return (
		<header className={css.header}>
			<A href="/games" className={css.logo}>Sword & Snail</A>

			<div className={css.menuWrap}>
				<button
					onClick={onToggleMenuClick}
					title="User Menu"
					id="userMenuBtn"
					aria-haspopup="true"
					aria-controls="userMenu"
					aria-expanded={menuOpen}
				>
					@
				</button>

				{menuOpen && (
					<ul
						className={css.menu}
						ref={menu}
						id="userMenu"
						role="menu"
						aria-labelledby="userMenuBtn"
					>
						<li><A href="/account" role="menuitem">My Account</A></li>
						{isDesigner && (
							<li><A href="/manage" role="menuitem">My Games</A></li>
						)}
						{isAdmin && (
							<li><A href="/admin" role="menuitem">Admin</A></li>
						)}
						<li><Button onClick={onLogoutClick} role="menuitem">Sign out</Button></li>
					</ul>
				)}
			</div>
		</header>
	)
}
