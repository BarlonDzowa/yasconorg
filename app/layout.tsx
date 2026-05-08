import { Roboto } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { QueryProvider } from "@/lib/query/QueryProvider";

export const metadata: Metadata = {
  title: "YASCON - Youth Association for Conservation of Nature and Environment",
  description:
    "YASCON mobilizes youth to protect nature, restore ecosystems, and build a sustainable future through grassroots conservation action.",
  keywords:
    "YASCON, Malawi, youth, conservation, environment, nature, tree planting",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
