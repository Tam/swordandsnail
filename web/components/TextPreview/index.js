import css from './style.module.scss';

export default function TextPreview ({ width }) {
	return (
		<div className={css.wrap}>
			<div className={css.width}>{width}</div>
			<div style={{ width: width + 'ch' }}>
				<p>Pommy ipsum down South sweets Shakespeare doing my nut in,
					nonsense alright geezer stew and dumps scones chips don't
					get your knickers in a twist, Shakespeare the chippy big
					light chips.</p>

				<p>Getting on my wick complete mare darling ee bah
					gum tad plum pudding hadn't done it in donkey's years off
					with her head, tip-top wellies lass bag egg's old boy
					treacle that's ace off the hook, chap fancied a flutter
					pezzy little Southeners blummin' Bad Wolf. One would like
					absobloodylootely Kate and Will cheerio done up like a
					kipper tad shortbread smeg two weeks on't trot, Victoria
					sponge cake black pudding eton mess scrote the lakes her
					Majesty's pleasure have a gander. </p>

				<p>Bread and butter pudding chuffed flabbergasted wind up 10
					pence mix taking the mick fish fingers and custard well fit,
					goggledegook twiglets a diamond geezer 'ar kid black pudding
					her Majesty's pleasure, munta down the village green double
					dutch anorak by 'eck love golly. Daft cow cheerio who
					brought loaf nose rag knows bugger all about nowt copper on
					a stag do doolally, don't get your knickers in a twist not
					some sort of dosshouse manky Southeners bit of a div gravy
					cheese and chips, queer as a clockwork orange chin up owt
					cockney supper grub's up. Porky-pies driving a mini sweet
					fanny adams loo a total jessie chav jolly conkers bread and
					butter pudding half-inch it, on his bill knee high to a
					grasshopper i'll be a monkey's uncle ey up duck ended up
					brown bread brown sauce good old fashioned knees up clotted
					cream challenge you to a duel. </p>
			</div>
		</div>
	);
}
