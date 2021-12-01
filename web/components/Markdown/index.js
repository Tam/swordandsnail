import css from './style.module.scss';
import { useEffect, useRef, useState } from 'react';

const normalizeText = html => html
	.replace(/<(div|p)>/g, '')
	.replace(/<br\/?><\/(div|p)>/g, '\n')
	.replace(/<\/(div|p)>/g, '\n');

export default function Markdown () {
	const input = useRef();
	const [value, setValue] = useState('');

	useEffect(() => {
		if (!input.current) return;

		const el = input.current;

		const onInput = e => setValue(normalizeText(e.target.innerHTML));

		const onPaste = e => {
			e.preventDefault();
			const paste = (e.clipboardData || window.clipboardData).getData('text/plain');
			const selection = window.getSelection();

			if (selection.rangeCount)
				selection.deleteFromDocument();

			document.execCommand('insertText', false, paste);
		};

		el.addEventListener('paste', onPaste);
		el.textContent =
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
		setValue(normalizeText(el.innerHTML));
		el.addEventListener('input', onInput);

		return () => {
			el.removeEventListener('paste', onPaste);
			el.removeEventListener('input', onInput);
		};
	}, [input]);

	return (
		<>
			<div
				className={css.md}
				ref={input}
				contentEditable
			/>
			<hr/>
			<pre
				style={{whiteSpace:'pre-wrap'}}
				dangerouslySetInnerHTML={{__html:value.replace(/\*\*(.*)\*\*/g, '<strong>**$1**</strong>')}}
			/>
		</>
	);
}
