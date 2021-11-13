import css from './style.module.scss';

export default function Input ({
	label,
	name,
	type = 'text',
	required = false,
	autoFocus = false,
}) {
	return (
		<label className={css.label}>
			<span>{label}</span>
			<input
				className={css.input}
				name={name}
				type={type}
				required={required}
				autoFocus={autoFocus}
			/>
		</label>
	);
}
