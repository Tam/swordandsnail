import css from './style.module.scss';

export default function Notice ({ label = 'Notice', children }) {
	return (
		<div className={css.notice} role="alert" aria-atomic="true">
			{!!label && <small>{label}</small>}
			<p>{children}</p>
		</div>
	);
}
