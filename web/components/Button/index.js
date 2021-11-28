import css from './style.module.scss';
import cls from '../../util/cls';

export default function Button ({
	type = 'button',
	onClick = void 0,
	disabled = false,
	wide = false,
	children,
}) {
	return (
		<button
			className={cls(css.button, {
				[css.wide]: wide,
			})}
			type={type}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
