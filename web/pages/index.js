import A from '../components/A';
import { SessionData } from '../lib/client';

export default function Index () {
	return (
		<>
			{SessionData.isLoggedIn ? (
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
