import { gql, useQuery } from 'urql';
import { useEffect } from 'react';
import css from '../styles/theme.module.scss';
import cls from '../util/cls';

export default function PreferencesHook () {
	const [{ data }] = useQuery({
		query: gql`
            query GetPreferences {
                viewer {
                    preference {
	                    id: nodeId
                        font
                        theme
                    }
                }
            }
		`,
	});

	const preferences = data?.viewer?.preference;

	useEffect(() => {
		document.body.className = cls(
			{
				'light': css.themeLight,
				'dark': css.themeDark,
				'system': css.themeSystem,
			}[preferences?.theme?.toLowerCase() ?? 'system'],
			{
				'mono': css.fontMono,
				'duo': css.fontDuo,
				'quattro': css.fontQuattro,
			}[preferences?.font?.toLowerCase() ?? 'quattro'],
		);
	}, [preferences]);

	return null;
}
