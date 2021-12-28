const lerp = (ax, ay, bx, by, t) => ([
	ax + (bx - ax) * t,
	ay + (by - ay) * t,
]);

const quad = (ax, ay, bx, by, cx, cy, t) => {
	const [dx, dy] = lerp(ax, ay, bx, by, t)
		, [ex, ey] = lerp(bx, by, cx, cy, t);

	return lerp(dx, dy, ex, ey, t);
};

export default function bezier ({ startY, ax, ay, bx, by, endY }, t) {
	const startX = 0, endX = 1;

	const [cx, cy] = quad(startX, startY, ax, ay, bx, by, t)
		, [dx, dy] = quad(ax, ay, bx, by, endX, endY, t);

	return lerp(cx, cy, dx, dy, t);
}
