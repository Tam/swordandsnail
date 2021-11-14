import css from './style.module.scss';
import Title from '../Title';
import formToJson from '../../util/formToJson';

export default function AuthForm ({ onSubmit, title, children }) {
	const _onSubmit = e => {
		e.preventDefault();
		onSubmit && onSubmit(formToJson(e.target));
	};

	return (
		<div className={css.wrap}>
			<Title>{title}</Title>
			<form className={css.form} onSubmit={_onSubmit}>
				<h1>Sword & Snail</h1>
				{children}
			</form>
		</div>
	);
}
