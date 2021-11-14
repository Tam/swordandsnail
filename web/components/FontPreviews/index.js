import css from './style.module.scss';
import capitalize from '../../util/capitalize';

const FONTS = {
	'mono': { by: 'iA', url: 'https://ia.net/' },
	'duo': { by: 'iA', url: 'https://ia.net/' },
	'quattro': { by: 'iA', url: 'https://ia.net/' },
};

export default function FontPreviews ({ font }) {
	const { by, url } = FONTS[font];

	return (
		<div className={css.wrap}>
			<figure className={css[font]}>
				<div>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
						Accusamus aperiam, distinctio enim illum inventore
						laboriosam mollitia necessitatibus omnis sequi
						voluptas?</p>
					<p>Aut dolorum ex exercitationem expedita inventore minima
						modi nihil possimus recusandae suscipit. At deserunt,
						laborum maxime nisi placeat quod quos.</p>
				</div>
				<figcaption><strong><em>{capitalize(font)}</em></strong> by <a href={url} target="_blank" rel="noopener noreferrer">{by}</a></figcaption>
			</figure>
		</div>
	);
}
