import css from './style.module.scss';
import A from '../A';
import { useContext, useEffect, useRef, useState } from 'react';
import Button from '../Button';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from 'urql';
import SessionContext from '../../contexts/SessionContext';

export default function Header () {
	const router = useRouter()
		, menu = useRef()
		, [{ isLoggedIn }, setSession] = useContext(SessionContext)
		, [menuOpen, setMenuOpen] = useState(false);

	const [{ data }, refetch] = useQuery({
		query: gql`
			query ViewerRole {
				viewer { account { role } }
			}
		`,
	});

	useEffect(() => {
		isLoggedIn && refetch({ requestPolicy: 'network-only' });
	}, [isLoggedIn]);

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
	}, [menuOpen, menu, router.events]);

	const onToggleMenuClick = () => setMenuOpen(o => !o);

	const onToggleFullscreenClick = () => {
		if (document.fullscreenElement) document.exitFullscreen();
		else document.documentElement.requestFullscreen();
	};

	const onLogoutClick = async () => {
		// TODO: clear urql cache
		setSession(p => ({ ...p, isLoggedIn: false }));
		await logout();
		await router.push('/'); // TODO: only redirect if they're on a protected page
	};

	const viewer = data?.viewer;
	const isAdmin = viewer?.account?.role?.toLowerCase() === 'admin';
	const isDesigner = viewer?.account?.role?.toLowerCase() === 'designer' || isAdmin;

	return (
		<header className={css.header}>
			<A href="/games" className={css.logo}>Sword & Snail</A>

			<div className={css.menuWrap}>
				<button onClick={onToggleFullscreenClick} title="Toggle Fullscreen">[ ]</button>

				{isLoggedIn && (
					<>
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
									<li><A href="/studio" role="menuitem">Studio</A></li>
								)}
								{isAdmin && (
									<li><A href="/admin" role="menuitem">Admin</A></li>
								)}
								<li><Button onClick={onLogoutClick} role="menuitem">Sign out</Button></li>
							</ul>
						)}
					</>
				)}
			</div>
		</header>
	)
}
