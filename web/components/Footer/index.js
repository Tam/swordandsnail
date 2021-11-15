import css from './style.module.scss';
import A from '../A';
import Clock from '../Clock';

export default function Footer () {
	return (
		<footer className={css.footer}>
			<Clock />
			<div>
				<A href="/terms">Terms & Conditions</A>
				{` | `}
				<A href="/privacy">Privacy Policy</A>
				{` | `}
				<a href="https://github.com/Tam/swordandsnail/issues" target="_blank" rel="noopener noreferrer">Report an issue</a>
				{` | `}
				<a href="https://github.com/Tam/swordandsnail/discussions" target="_blank" rel="noopener noreferrer">Suggest a feature</a>
			</div>
		</footer>
	);
}
