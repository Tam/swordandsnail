import css from './style.module.scss';

export default function Input ({
	label,
	name,
	type = 'text',
	required = false,
	autoFocus = false,
	defaultValue,
	children,
	...props
}) {
	return (
		<label className={css.label}>
			<span>{label}</span>
			{type === 'select' ? (
				<span className={css.select}>
					<select
						name={name}
						required={required}
						defaultValue={defaultValue}
						{...props}
					>
						{children}
					</select>
				</span>
			) : (
				<input
					className={css.input}
					name={name}
					type={type}
					required={required}
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					{...props}
				/>
			)}
		</label>
	);
}
