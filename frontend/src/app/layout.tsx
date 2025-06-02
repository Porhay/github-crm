import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const robotoMono = Roboto_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable}`}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
