import css from './style.module.scss';
import { useEffect, useRef, useState } from 'react';
import { parse } from 'marked';
import cls from '../../util/cls';
import Prose from '../Prose';

export default function Markdown ({ name, label, defaultValue = '' }) {
	const self = useRef();

	const [value, setValue] = useState(defaultValue)
		, [focus, setFocus] = useState(false);

	const onInput = e => {
		let { borderTopWidth, borderBottomWidth } = window.getComputedStyle(e.target);
		borderTopWidth = +borderTopWidth.replace(/[^\d.]/g, '');
		borderBottomWidth = +borderBottomWidth.replace(/[^\d.]/g, '');
		e.target.style.height = '';
		e.target.style.height = (e.target.scrollHeight + borderTopWidth + borderBottomWidth) + 'px';
	};

	const onFocus = () => setFocus(true)
		, onBlur  = () => setFocus(false);

	useEffect(() => {
		if (self.current) {
			onInput({ target: self.current });
			setValue(defaultValue);
		}
	}, [defaultValue, self]);

	return (
		<label className={cls(css.wrap, {
			[css.focus]: focus,
		})}>
			{label && <span>{label}</span>}
			<div className={css.label}>
				<textarea
					ref={self}
					name={name}
					onInput={onInput}
					className={css.input}
					onChange={e => setValue(e.target.value)}
					defaultValue={defaultValue}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				<hr/>
				<Prose>{parse(value)}</Prose>
			</div>
		</label>
	);
}
