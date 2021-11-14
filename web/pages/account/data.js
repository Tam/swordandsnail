import AccountLayout from '../../components/AccountLayout';
import Button from '../../components/Button';

export default function Data () {
	return (
		<AccountLayout title="My Data">
			<p>
				Download all your data in a <code>.zip</code><br/>
				We'll email you when the file is ready for download!
			</p>
			<Button>Download</Button>
		</AccountLayout>
	);
}
