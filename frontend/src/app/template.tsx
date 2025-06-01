import { metadata } from './metadata';
import ClientLayout from './layout';

export { metadata };

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
} 