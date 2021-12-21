import { createContext } from 'react';

const SessionContext = createContext({
	isLoggedIn: false,
});

export default SessionContext;
