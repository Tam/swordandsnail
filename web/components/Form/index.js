import css from './style.module.scss';
import formToJson from '../../util/formToJson';
import cls from '../../util/cls';

export default function Form ({ onSubmit, children, ...props }) {
	const _onSubmit = e => {
		e.preventDefault();
		onSubmit && onSubmit(formToJson(e.target), e);
	};

	return (
		<form {...props} onSubmit={_onSubmit} className={cls(css.form, props.className)}>
			{children}
		</form>
	);
}
