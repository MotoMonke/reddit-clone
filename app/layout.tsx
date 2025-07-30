import type { Metadata } from "next";
import Head from "next/head";
import "./ui/global.css"
import Logo from "./ui/components/header/icons/logo";
import CreatePostIcon from "./ui/components/header/icons/createPostIcon";
import SearchIcon from "./ui/components/header/icons/searchIcon";
import UserControls from "./ui/components/header/userControls";

export const metadata: Metadata = {
  title: "Reddit clone",
  description: "Created for learning purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className="h-screen bg-[#141414]">
        <header className="z-50 fixed bg-[#141414] top-0 right-0 left-0 text-white p-4 flex items-center justify-between border-b border-b-gray-400 h-20">
          <Logo/>
          <SearchIcon/>
          <UserControls/>
        </header>
        <main className="pt-20 h-[calc(100vh-5rem)] text-white overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}