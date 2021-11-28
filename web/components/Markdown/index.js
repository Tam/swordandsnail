import css from './style.module.scss';
import { useEffect, useRef } from 'react';

export default function Markdown () {
	const input = useRef();

	useEffect(() => {
		if (!input.current) return;

		const onPaste = e => {
			e.preventDefault();
			const paste = (e.clipboardData || window.clipboardData).getData('text/plain');
			const selection = window.getSelection();

			if (selection.rangeCount)
				selection.deleteFromDocument();

			document.execCommand('insertText', false, paste);
		};

		input.current.addEventListener('paste', onPaste);
		input.current.textContent =
			'I have a basic editor based on execCommand following the sample introduced here. There are three ways to paste text within the execCommand area:\n' +
			'\n' +
			'    Ctrl+V\n' +
			'    Right Click -> Paste\n' +
			'    Right Click -> Paste As Plain Text\n' +
			'\n' +
			'I want to allow pasting only plain text without any HTML markup. How can I force the first two actions to paste Plain Text?\n' +
			'\n' +
			'Possible Solution: The way I can think of is to set listener for keyup events for (Ctrl+V) and strip HTML tags before paste.\n' +
			'\n' +
			'    Is it the best solution?\n' +
			'    Is it bulletproof to avoid any HTML markup in paste?\n' +
			'    How to add listener to Right Click -> Paste?';

		return () => {
			input.current.removeEventListener('paste', onPaste);
		};
	}, [input]);

	return (
		<div
			className={css.md}
			ref={input}
			contentEditable
		/>
	);
}
