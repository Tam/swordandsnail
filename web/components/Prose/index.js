import React from 'react';
import css from './style.module.scss';
import cls from '../../util/cls';
import parse, { domToReact } from 'html-react-parser';
import A from '../A';

const options = {
	replace: domNode => {
		switch (domNode.name) {
			case 'a':
				const { href } = domNode.attribs;
				if (href[0] === '#' || href.startsWith('mailto:')) return;
				if (href[0] === '/' && href[1] !== '/') return (
					<A {...domNode.attribs}>
						{domToReact(domNode.children, options)}
					</A>
				);

				return (
					<a {...domNode.attribs} target="_blank" rel="noopener noreferrer">
						{domToReact(domNode.children, options)}
					</a>
				);
		}
	},
};

export default function Prose ({
	El = 'div',
	className,
	children,
	horizontalCenter = false,
	...props
}) {
	return (
		<div
			className={cls(css.prose, className, {
				[css.horizontalCenter]: horizontalCenter
			})}
			{...props}
		>
			{React.Children.map(children, child => {
				if (typeof child === 'string') {
					const parsed = parse(child, options);

					if (typeof parsed === 'string')
						return <p>{parsed}</p>;

					return parsed;
				}

				return child;
			})}
		</div>
	);
}

