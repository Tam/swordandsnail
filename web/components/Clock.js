import { useEffect, useRef } from 'react';

export default function Clock () {
	const self = useRef();

	useEffect(() => {
		if (!self.current) return;

		const loop = setInterval(() => {
			self.current.textContent = (new Date()).toLocaleString(void 0, {
				dateStyle: 'full',
				timeStyle: 'medium',
			});
		}, 1000);

		return () => clearInterval(loop);
	}, []);

	return <span ref={self} />;
}
