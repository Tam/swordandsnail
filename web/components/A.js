import Link from 'next/link';

export default function A ({
	href,
	className,
	children,
	El = 'a',
	elProps = {},
}) {
	return (
		<Link href={href} passHref>
			<El {...elProps} className={className}>
				{children}
			</El>
		</Link>
	);
}
