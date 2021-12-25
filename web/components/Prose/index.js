import React from 'react';
import css from './style.module.scss';
import cls from '../../util/cls';
import parse from 'html-react-parser';

export default function Prose ({
	El = 'div',
	className,
	children,
	...props
}) {
	return (
		<div className={cls(css.prose, className)} {...props}>
			{React.Children.map(children, child => {
				if (typeof child === 'string') {
					const parsed = parse(child);

					if (typeof parsed === 'string')
						return <p>{parsed}</p>;

					return parsed;
				}

				return child;
			})}
		</div>
	);
}

