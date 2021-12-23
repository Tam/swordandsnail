import css from './style.module.scss';
import cls from '../../util/cls';
import A from '../A';

export default function Button ({
	type = 'button',
	onClick = void 0,
	disabled = false,
	wide = false,
	children,
	href,
}) {
	const El = href ? A : 'button';

	return (
		<El
			className={cls(css.button, {
				[css.wide]: wide,
			})}
			type={type}
			onClick={onClick}
			disabled={disabled}
			href={href}
		>
			{children}
		</El>
	);
}
