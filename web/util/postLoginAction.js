export default async function postLoginAction (setSession, router) {
	setSession(p => ({ ...p, isLoggedIn: true }));
	await router.push('/games');
}
