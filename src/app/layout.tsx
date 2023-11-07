import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./global.css";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal?: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-9000 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12  bg-slate-50 antialiased">
        {/*  @ts-expect-error server component */}
        <Navbar />
        {authModal}
        <div className="container max-w-7xl mx-auto h-full pt-12"></div>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
