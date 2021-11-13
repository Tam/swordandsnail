import css from './style.module.scss';

export default function Button ({
	type = 'button',
	onClick = void 0,
	children,
}) {
	return (
		<button
			className={css.button}
			type={type}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
