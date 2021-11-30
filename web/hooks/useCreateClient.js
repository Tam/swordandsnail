import { useMemo } from 'react';
import createClient from '../lib/client';

/**
 * @returns {Client}
 */
export default function useCreateClient () {
	return useMemo(() => {
		return createClient();
	}, []);
}
