import css from './style.module.scss';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

export default function Dialog ({ isOpen, onRequestClose, children }) {
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			overlayClassName={css.overlay}
			className={css.modal}
		>
			{children}
		</Modal>
	);
}
