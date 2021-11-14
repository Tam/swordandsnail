import AccountLayout from '../../components/AccountLayout';
import A from '../../components/A';
import Button from '../../components/Button';
import { useState } from 'react';
import Dialog from '../../components/Dialog';
import Input from '../../components/Input';
import Form from '../../components/Form';

export default function Danger () {
	const [isOpen, setIsOpen] = useState(false);

	const onDeleteClick = () => setIsOpen(true);
	const onRequestClose = () => setIsOpen(false);

	return (
		<AccountLayout title="Danger Zone">
			<p><strong><em>*** DANGER ***</em></strong></p>
			<p>Use the button below to delete your account.<br/>
				This will <strong> destroy</strong> all of your live data, however data will persist in backups for up to 4 weeks.<br/>
				Use the <A href="/account/data">My Data</A> area to download your data if you want to keep it.</p>

			<Button onClick={onDeleteClick}>Delete Account</Button>

			<Dialog isOpen={isOpen} onRequestClose={onRequestClose}>
				<Form>
					<p>Type <strong>armed gastropod</strong> below to confirm your account deletion.</p>
					<Input name="confirm" required />
					<Button>Confirm Deletion</Button>
				</Form>
			</Dialog>
		</AccountLayout>
	);
}
