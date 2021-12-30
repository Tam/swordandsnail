export default class Renderer {

	_canvas;
	_ctx;
	_width;
	_height;

	_zoom = 1;
	_camera = { x: 0, y: 0 };

	_cellWidth;
	_cellHeight;

	_textColour;

	_buffer = [];

	constructor (canvas, width = 100, height = 50) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._width = width;
		this._height = height;

		this._textColour = window.getComputedStyle(document.body).getPropertyValue('color');

		this._calculateSizing();
	}

	_calculateSizing = () => {
		const lineHeight = 1.2
			, pixelRatio = window.devicePixelRatio || 1;

		const calculatedFontSize = window.innerWidth / this._width;
		const cellWidth = calculatedFontSize * pixelRatio
			, cellHeight = calculatedFontSize * lineHeight * pixelRatio
			, fontSize = calculatedFontSize * pixelRatio * this._zoom;

		this._cellWidth = cellWidth * this._zoom;
		this._cellHeight = cellHeight * this._zoom;

		this._canvas.style.cssText = `
			width: ${calculatedFontSize * this._width}; 
			height: ${calculatedFontSize * lineHeight * this._height};
		`;
		this._canvas.width = cellWidth * this._width;
		this._canvas.height = cellHeight * this._height;

		this._ctx.font = `normal ${fontSize}px ${window.getComputedStyle(document.body).getPropertyValue('font-family').split(',')[0]}`;
		this._ctx.textAlign = 'center';
		this._ctx.textBaseline = 'middle';
	}

	// Viewport
	// =========================================================================

	setZoom = valueOrCallback => {
		if (typeof valueOrCallback === 'function')
			valueOrCallback = valueOrCallback(this._zoom);

		if (valueOrCallback < 1) valueOrCallback = 1;
		else if (valueOrCallback > 3) valueOrCallback = 3;

		// TODO: Move the camera to keep it centered
		//  1. get the current center cell
		//  2. find the cell offset
		//  3. calculate the new cell offset
		//  4. set the zoom
		//  5. set the new offset

		this._zoom = valueOrCallback;
		this._calculateSizing();
		this._clampCamera();
		this.blit();
	}

	moveCamera = (x = 0, y = 0) => {
		this._camera.x += x;
		this._camera.y += y;
		this._clampCamera();
		this.blit();
	}

	_clampCamera = () => {
		if (this._camera.x > 0) this._camera.x = 0;
		if (this._camera.y > 0) this._camera.y = 0;

		// TODO: clamp right / bottom
		// TODO: move around center of screen rather than top left
	}

	// Rendering
	// =========================================================================

	clearCanvas = () => {
		this._buffer = [];
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	clearCell = (x, y) => {
		this._buffer.push([
			'clearCell',
			{ x, y },
		]);
	}

	drawChar = (char, x, y) => {
		if (!char) return;

		this._buffer.push([
			'drawChar',
			{ char, x, y },
		]);
	}

	drawDebugLine = (ax, ay, bx, by) => {
		this._buffer.push([
			'drawDebugLine',
			{ ax, ay, bx, by }
		]);
	}

	blit = () => {
		requestAnimationFrame(this._blit.bind(this));
	}

	_blit () {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

		this._buffer.forEach(([key, args]) => {
			switch (key) {
				case 'clearCell': {
					const pos = this._cellToPos(args.x, args.y);

					if (this._cullCellByPos(pos))
						return;

					this._ctx.clearRect(
						pos.x,
						pos.y,
						this._cellWidth,
						this._cellHeight
					);
					break;
				}
				case 'drawChar': {
					const pos = this._cellCentreToPos(args.x, args.y);

					if (this._cullCellByPos(pos))
						return;

					this._ctx.fillStyle = this._textColour;
					this._ctx.fillText(
						args.char,
						pos.x,
						pos.y
					);
					break;
				}
				case 'drawDebugLine': {
					const { ax, ay, bx, by } = args;

					const a = this._cellCentreToPos(ax, ay)
						, b = this._cellCentreToPos(bx, by);

					if (
						a.x && b.x >= this._canvas.width
						|| a.y && b.y >= this._canvas.height
						|| a.x && b.x <= 0
						|| a.y && b.y <= 0
					) return;

					this._ctx.beginPath();
					this._ctx.moveTo(a.x, a.y);
					this._ctx.lineTo(b.x, b.y);
					this._ctx.lineWidth = this._cellWidth / 5;
					this._ctx.strokeStyle = 'magenta';
					this._ctx.stroke();
					break;
				}
			}
		});
	}

	// Helpers
	// =========================================================================

	// Helpers: Render
	// -------------------------------------------------------------------------

	_cullCellByPos = pos => (
		pos.x >= this._canvas.width
		|| pos.y >= this._canvas.height
		|| pos.x + this._cellWidth <= 0
		|| pos.y + this._cellHeight <= 0
	)

	// Helpers: Position
	// -------------------------------------------------------------------------

	_cellToPos = (x, y) => ({
		x: x * this._cellWidth + this._camera.x * this._cellWidth,
		y: y * this._cellHeight + this._camera.y * this._cellHeight,
	});

	_cellCentreToPos = (x, y) => {
		const pos = this._cellToPos(x, y);

		return {
			x: pos.x + this._cellWidth / 2,
			y: pos.y + this._cellHeight / 2,
		};
	};

}
