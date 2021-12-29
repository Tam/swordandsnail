import css from './style.module.scss';
import cls from '../../util/cls';

export default function Input ({
	label,
	name,
	type = 'text',
	required = false,
	autoFocus = false,
	defaultValue,
	defaultChecked = false,
	children,
	...props
}) {
	return (
		<label className={cls(css.label, {
			[css.isCheckbox]: type === 'checkbox',
		})}>
			{label && <span>{label}</span>}
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
			) : type === 'checkbox' ? (
				<input
					className={css.checkbox}
					type="checkbox"
					name={name}
					required={required}
					value={defaultValue}
					defaultChecked={defaultChecked}
					{...props}
				/>
			) : (
				<input
					className={css.input}
					type={type}
					name={name}
					required={required}
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					{...props}
				/>
			)}
		</label>
	);
}
