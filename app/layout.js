import { Inter } from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat Vibe",
  description: "Elevate your conversations with Chat Vibe – a dynamic and user-friendly chat application. Connect with friends, share moments, and experience seamless communication. Join Chat Vibe today for a vibrant and engaging chat experience like never before!",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Toaster position="bottom-center " />
        {children}
      </body>
    </html>
  );
}
