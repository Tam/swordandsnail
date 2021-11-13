import css from './style.module.scss';

export default function Error ({ children }) {
	return (
		<div className={css.error} role="alert" aria-atomic="true">
			<small>Error</small>
			<p>{children}</p>
		</div>
	);
}
