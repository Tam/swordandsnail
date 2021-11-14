import css from './style.module.scss';
import capitalize from '../../util/capitalize';

export default function FontPreviews () {
	return (
		<div className={css.wrap}>
			{[
				{ font: 'mono', by: 'iA', url: 'https://ia.net/' },
				{ font: 'duo', by: 'iA', url: 'https://ia.net/' },
				{ font: 'quattro', by: 'iA', url: 'https://ia.net/' },
			].map(({ font, by, url }) => (
				<figure className={css[font]} key={font}>
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
			))}
		</div>
	);
}
