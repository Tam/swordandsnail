import css from './style.module.scss';

export default function Button ({
	type = 'button',
	onClick = void 0,
	disabled = false,
	children,
}) {
	return (
		<button
			className={css.button}
			type={type}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
