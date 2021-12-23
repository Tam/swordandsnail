import css from './style.module.scss';
import { useState } from 'react';
import { parse } from 'marked';
import cls from '../../util/cls';

export default function Markdown ({ name, label, defaultValue = '' }) {
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

	return (
		<label className={cls(css.wrap, {
			[css.focus]: focus,
		})}>
			{label && <span>{label}</span>}
			<div className={css.label}>
				<textarea
					name={name}
					onInput={onInput}
					className={css.input}
					onChange={e => setValue(e.target.value)}
					defaultValue={defaultValue}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				<hr/>
				<div dangerouslySetInnerHTML={{__html:parse(value)}}/>
			</div>
		</label>
	);
}
