import css from './style.module.scss';
import themeCss from '../../styles/theme.module.scss';
import cls from '../../util/cls';
import capitalize from '../../util/capitalize';

export default function ThemePreview ({ theme }) {
	return (
		<div className={cls(css.themePreview, themeCss[`theme${capitalize(theme)}`])}>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum
				dicta ex facilis impedit ipsum libero quae quam ratione rem
				voluptatibus.</p>
			<p>Ab architecto cum cumque cupiditate, error
				expedita incidunt itaque, iusto labore non odit quam quas quos
				ratione reiciendis repellendus voluptate?</p>
		</div>
	);
}
