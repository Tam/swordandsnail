import css from './style.module.scss';

export const Stats = ({ children }) => <section className={css.stats}>{children}</section>;

export default function Stat ({ value, label }) {
	return (
		<div className={css.stat}>
			<strong className={css.value} data-value={value}>{value}</strong>
			<span className={css.label}>{label}</span>
		</div>
	);
}
