import css from './style.module.scss';
import dynamic from 'next/dynamic';
import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import cls from '../../util/cls';

function TooltipElComponent () {
	const self = useRef();
	const [content, setContent] = useState(null)
		, [visible, setVisible] = useState(0);
	TooltipElComponent.setContent = setContent;
	TooltipElComponent.setVisible = setVisible;

	useEffect(() => {
		if (!self.current) return;

		const el = self.current;
		const onMouseMove = e => {
			let x = e.clientX + 10,
				y = e.clientY + 10;

			const rect = el.getBoundingClientRect();

			const rgt = x + rect.width
				, btm = y + rect.height;

			if (rgt > window.innerWidth - 10)
				x -= rect.width + 10;

			if (btm > window.innerHeight - 10)
				y -= (btm - window.innerHeight) + 10;

			el.style.setProperty('--x', x + 'px');
			el.style.setProperty('--y', y + 'px');
		};

		document.addEventListener('mousemove', onMouseMove, false);

		return () => {
			document.removeEventListener('mousemove', onMouseMove, false);
		};
	}, [self]);

	return (
		<div className={cls(css.tooltip, { [css.visible]: visible })} ref={self}>
			{content}
		</div>
	);
}

export default function Tooltip ({ content, children }) {
	const [isVisible, setIsVisible] = useState(false);

	const onMouseEnter = () => {
		if (!isVisible) TooltipElComponent.setVisible(v => v + 1);
		setIsVisible(true);
		TooltipElComponent.setContent(content);
	};
	const onMouseLeave = () => {
		TooltipElComponent.setVisible(v => v - 1);
		setIsVisible(false);
	};

	useEffect(() => {
		if (isVisible) TooltipElComponent.setContent(content);
	}, [content]);

	return Children.map(children, child => {
		return cloneElement(child, {
			onMouseEnter,
			onMouseLeave,
		});
	});
}

const TooltipEl = dynamic(() => Promise.resolve(TooltipElComponent), { ssr: false });

export { TooltipEl };
