import A from '../components/A';
import { useContext } from 'react';
import SessionContext from '../contexts/SessionContext';

export default function Index () {
	const [{ isLoggedIn }] = useContext(SessionContext);

	return (
		<>
			{isLoggedIn ? (
				<p><A href="/games">Games</A></p>
			) : (
				<>
					<p><A href="/signin">Sign In</A></p>
					<p><A href="/signup">Sign Up</A></p>
				</>
			)}
		</>
	);
}
