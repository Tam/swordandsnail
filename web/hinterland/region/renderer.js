export default class Renderer {

	_canvas;
	_ctx;
	_width;
	_height;

	_cellWidth;
	_cellHeight;

	_textColour;

	constructor (canvas, width = 100, height = 50) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._width = width;
		this._height = height;

		this._textColour = window.getComputedStyle(document.body).getPropertyValue('color');

		const lineHeight = 1.2
			, pixelRatio = window.devicePixelRatio || 1;

		const calculatedFontSize = window.innerWidth / width;
		const cellWidth = calculatedFontSize * pixelRatio
			, cellHeight = calculatedFontSize * lineHeight * pixelRatio
			, fontSize = calculatedFontSize * pixelRatio;

		this._cellWidth = cellWidth;
		this._cellHeight = cellHeight;

		this._canvas.style.cssText = `
			width: ${calculatedFontSize * width}; 
			height: ${calculatedFontSize * lineHeight * height};
		`;
		this._canvas.width = cellWidth * width;
		this._canvas.height = cellHeight * height;

		this._ctx.font = `normal ${fontSize}px ${window.getComputedStyle(document.body).getPropertyValue('font-family').split(',')[0]}`;
		this._ctx.textAlign = "center";
		this._ctx.textBaseline = "middle";
	}

	clearCanvas = () => {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	clearCell = (x, y) => {
		this._ctx.clearRect(x, y, this._cellWidth, this._cellHeight);
	}

	drawChar = (c) => {
		if (!c) return;
		const { char, position } = c;

		this._ctx.fillStyle = this._textColour;
		this._ctx.fillText(
			char,
			position.x * this._cellWidth + this._cellWidth / 2,
			position.y * this._cellHeight + this._cellHeight / 2
		);
	}

}
