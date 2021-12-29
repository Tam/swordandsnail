import css from './style.module.scss';
import Notice from '../Notice';
import cls from '../../util/cls';
import { useEffect, useRef, useState } from 'react';
import { Listen, Signal } from '../../util/signal';
import uuid from '../../util/uuid';

export default function Notifications () {
	const self = useRef();
	const [items, setItems] = useState({});

	const removeByKey = key => {
		const target = self.current.querySelector(`[data-key="${key}"]`);

		if (target.classList.contains(css.exit))
			return;

		target.classList.add(css.exit);
		target.classList.remove(css.enter);

		setTimeout(() => setItems(old => {
			const next = {...old};
			delete next[key];
			return next;
		}), 500);
	};

	useEffect(() => Listen(Signal.Notify, ({ label = null, message }) => {
		const key = uuid();

		setItems(old => ({
			...old,
			[key]: { label, message },
		}));

		requestIdleCallback(() => {
			self.current.querySelector(`[data-key="${key}"]`)
				.classList.add(css.enter);
		});
		setTimeout(() => removeByKey(key), 5000);
	}), [self]);

	const onClick = key => () => removeByKey(key);

	return (
		<ul
			className={css.notifications}
			ref={self}
		>
			{Object.entries(items).map(([key, { label, message }]) => (
				<li
					data-key={key}
					key={key}
					className={cls(css.item)}
					onClick={onClick(key)}
				>
					<Notice label={label}>
						{message}
					</Notice>
				</li>
			))}
		</ul>
	);
}
