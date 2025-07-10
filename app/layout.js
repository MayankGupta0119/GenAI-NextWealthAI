import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "NextWealthAI",
  description: "AI-powered financial assistant to manage your finances",
  icons: {
    icon: "/bar_logo.png", // This will use your bar_logo.png as the favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* header */}
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/* search engine will know where the main content of the file is*/}
          {/* footer */}
          {/* <footer className="bg-blue-50 py-12">
            <div className="container mx-auto text-center px-4 text-gray-800">
              <p>Made with passion</p>
            </div>
          </footer> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
