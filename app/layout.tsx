import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QuizLockProvider } from "@/context/QuizLockContext";
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
  keywords: "database quiz, SQL quiz, database concepts, AI quiz, normalization, ER modeling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QuizLockProvider>
          {children}
        </QuizLockProvider>
      </body>
    </html>
  );
}
