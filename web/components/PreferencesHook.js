import { gql, useQuery } from 'urql';
import { useContext, useEffect } from 'react';
import css from '../styles/theme.module.scss';
import cls from '../util/cls';
import capitalize from '../util/capitalize';
import SessionContext from '../contexts/SessionContext';

export default function PreferencesHook () {
	const [{ isLoggedIn }] = useContext(SessionContext);

	const [{ data }, refetch] = useQuery({
		query: gql`
            query GetPreferences {
                viewer {
	                id
                    preference {
	                    id: nodeId
                        font
                        theme
	                    textColumnWidth
                    }
                }
            }
		`,
	});

	useEffect(() => {
		isLoggedIn && refetch({ requestPolicy: 'network-only' });
	}, [isLoggedIn]);

	const preferences = data?.viewer?.preference;

	useEffect(() => {
		document.body.className = cls(
			css[`theme${capitalize(preferences?.theme?.toLowerCase() ?? 'system')}`],
			css[`font${capitalize(preferences?.font?.toLowerCase() ?? 'quattro')}`],
		);
		document.body.style.setProperty('--theme_text-column-width', (preferences?.textColumnWidth ?? 120) + 'ch');
	}, [preferences]);

	return null;
}
