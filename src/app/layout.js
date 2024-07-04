import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Royal corner",
  description: "للتسويق الالكتروني",
  googleٍiteVerification : "-1HDfMA8r2MPfNp6oa5PTR1Pe2Z-g4CThr_hEn1rIsM",
};

{/* <meta name="google-site-verification" content="-1HDfMA8r2MPfNp6oa5PTR1Pe2Z-g4CThr_hEn1rIsM" /> */}

export default function RootLayout({ children }) {
  return (
    <html lang="an" rel="rtl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
