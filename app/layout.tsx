import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QuizLockProvider } from "@/context/QuizLockContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Think Tech DB Guru - AI Quiz Service",
  description: "Master database concepts with AI-powered quizzes. Test your knowledge of SQL, normalization, ER modeling, and more.",
  keywords: "database quiz, SQL quiz, database concepts, AI quiz, normalization, ER modeling, database learning, educational technology",
  authors: [{ name: "Think Tech DB Guru" }],
  robots: "index, follow",
  openGraph: {
    title: "Think Tech DB Guru - AI Quiz Service",
    description: "Master database concepts with AI-powered quizzes",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QuizLockProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </QuizLockProvider>
      </body>
    </html>
  );
}
