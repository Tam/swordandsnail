import css from './style.module.scss';
import Title from '../Title';
import formToJson from '../../util/formToJson';
import A from '../A';

export default function AuthForm ({ onSubmit, title, children }) {
	const _onSubmit = e => {
		e.preventDefault();
		onSubmit && onSubmit(formToJson(e.target));
	};

	return (
		<div className={css.wrap}>
			<Title>{title}</Title>
			<form className={css.form} onSubmit={_onSubmit}>
				<h1><A href="/">Sword & Snail</A></h1>
				{children}
			</form>
		</div>
	);
}
