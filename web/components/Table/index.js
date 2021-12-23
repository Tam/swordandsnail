import css from './style.module.scss';
import get from 'lodash.get';
import A from '../A';
import capitalize from '../../util/capitalize';
import cls from '../../util/cls';

export const TblFmt = {
	timestamp: function Timestamp (d) {
		return (new Date(d)).toLocaleString('en-GB', {
			dateStyle: 'short',
			timeStyle: 'short',
		});
	},

	link: (href, overrideValue) => function Link (value, row) {
		return (
			<A href={typeof href === 'function' ? href(value, row) : href}>
				{overrideValue ?? value}
			</A>
		);
	},

	capitalize: function Capitalize (value) {
		return capitalize(value, true);
	},
};

export default function Table ({
	columns,
	data,
}) {
	return (
		<table className={css.table}>
			<thead>
			<tr>
				{columns.map(col => (
					<th
						key={col.handle}
						className={cls({ [css.thin]: !col.label })}
					>
						{col.label}
					</th>
				))}
			</tr>
			</thead>
			<tbody>
			{data?.map((row, i) => (
				<tr key={i}>
					{columns.map(col => (
						<td key={col.handle}>
							{typeof col.render === 'function'
								? col.render(get(data[i], col.handle), data[i])
								: get(data[i], col.handle)}
						</td>
					))}
				</tr>
			))}
			{!data?.length && (
				<tr>
					<td colSpan={columns.length}>
						No results
					</td>
				</tr>
			)}
			</tbody>
		</table>
	);
}
