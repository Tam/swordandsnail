import css from './style.module.scss';
import { useRef, useState } from 'react';
import clamp from '../../util/clamp';

export const BEZIER_DEFAULT = {
	startY: 0,
	ax: 0.25,
	ay: 0.25,
	bx: 0.75,
	by: 0.75,
	endY: 1,
};

export default function BezierInput ({
	defaultValue,
	onInput,
	label,
}) {
	const self = useRef();
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState({
		startY: 1 - (defaultValue?.startY ?? 0),
		ax: defaultValue?.ax ?? 0.25,
		ay: 1 - (defaultValue?.ay ?? 0.75),
		bx: defaultValue?.bx ?? 0.75,
		by: 1 - (defaultValue?.by ?? 0.25),
		endY: 1 - (defaultValue?.endY ?? 1),
	});

	const onDocumentClick = e => {
		if (e.target !== self.current && !self.current.contains(e.target)) {
			setEditing(false);
			document.removeEventListener('mousedown', onDocumentClick);
		}
	};

	const onPreviewClick = () => {
		setEditing(true);
		document.addEventListener('mousedown', onDocumentClick);
	};

	const onMouseMove = e => {
		e.preventDefault();
		const t = self.current;
		const p = t.__id
			, r = t.getBoundingClientRect();

		const m = {
			x: clamp((e.clientX - r.x) / r.width, 0, 1),
			y: clamp((e.clientY - r.y) / r.height, 0, 1),
		};

		setValue(v => {
			const next = (p.length === 1 ? {
				...v,
				[`${p}x`]: m.x,
				[`${p}y`]: m.y,
			} : {
				...v,
				[`${p}Y`]: m.y,
			});

			if (e.getModifierState('Shift')) {
				switch (p) {
					case 'start':
					case 'b':
						next.ax = m.x;
						next.ay = m.y;
						break;
					case 'end':
					case 'a':
						next.bx = m.x;
						next.by = m.y;
						break;
				}
			}

			onInput && setTimeout(() => onInput({
				startY: 1 - next.startY,
				ax: next.ax,
				ay: 1 - next.ay,
				bx: next.bx,
				by: 1 - next.by,
				endY: 1 - next.endY,
			}), 0);
			return next;
		});
	};
	const onMouseUp = e => {
		onMouseMove(e);
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	};
	const onMouseDown = e => {
		self.current.__id = e.target.id;
		onMouseMove(e);
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	};

	return (
		<label className={css.label}>
			<span>{label}</span>
			{editing ? (
				<svg
					width={300}
					height={300}
					viewBox="0 0 300 300"
					preserveAspectRatio="none"
					className={css.input}
					onMouseDown={onMouseDown}
					ref={self}
				>
					<path
						d={`M0,${300 * value.startY} C${300 * value.ax},${300 * value.ay} ${300 * value.bx},${300 * value.by} 300,${300 * value.endY}`}
						className={css.miniPath}
					/>

					<line x1="0" y1={300 * value.startY} x2={300 * value.ax} y2={300 * value.ay} />
					<line x1="300" y1={300 * value.endY} x2={300 * value.bx} y2={300 * value.by} />

					<circle id="start" cx="0" cy={300 * value.startY} r="16" />
					<circle id="end" cx="300" cy={300 * value.endY} r="16" />

					<circle id="a" cx={300 * value.ax} cy={300 * value.ay} r="8" />
					<circle id="b" cx={300 * value.bx} cy={300 * value.by} r="8" />
				</svg>
			) : (
				<svg
					width={300}
					height={50}
					viewBox="0 0 300 50"
					preserveAspectRatio="none"
					className={css.preview}
					onClick={onPreviewClick}
				>
					<path
						d={`M0,${50 * value.startY} C${300 * value.ax},${50 * value.ay} ${300 * value.bx},${50 * value.by} 300,${50 * value.endY}`}
						className={css.miniPath}
					/>
				</svg>
			)}
		</label>
	);
}
