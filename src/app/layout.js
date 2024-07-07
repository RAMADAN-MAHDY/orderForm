import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Royal corner",
  description: "للتسويق الالكتروني",
};

{/* <meta name="google-site-verification" content="-1HDfMA8r2MPfNp6oa5PTR1Pe2Z-g4CThr_hEn1rIsM" /> */}

export default function RootLayout({ children }) {
  return (
    <html lang="an" rel="rtl">
        <head>
        <meta name="google-site-verification" content="-1HDfMA8r2MPfNp6oa5PTR1Pe2Z-g4CThr_hEn1rIsM" />
        <link rel="icon" href="/image.ico" sizes="32x32"/>
        </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
