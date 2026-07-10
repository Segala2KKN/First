import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Desa Sengkol",
  description: "Website resmi Desa Sengkol, Kecamatan Pujut, Lombok Tengah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
