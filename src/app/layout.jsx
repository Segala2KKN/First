import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Desa Sengkol",
  description: "Website resmi Desa Sengkol, Kecamatan Pujut, Lombok Tengah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geist.variable} ${playfair.variable}`}>
      <body className={geist.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
