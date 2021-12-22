import { withUrqlClient } from 'next-urql';
import { clientOpts } from '../lib/client';

export default function withSsr (Component) {
	return withUrqlClient(clientOpts, { ssr: !process.browser })(Component);
}
