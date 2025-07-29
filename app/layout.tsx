import type { Metadata } from "next";
import Head from "next/head";
import "./ui/global.css"
import Logo from "./ui/components/header/icons/logo";
import CreatePostIcon from "./ui/components/header/icons/createPostIcon";
import SearchIcon from "./ui/components/header/icons/searchIcon";
import NotificationsAndProfile from "./ui/components/header/notificationsAndProfile";
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
        <header className="fixed bg-[#141414] top-0 right-0 left-0 text-white p-4 flex justify-between align-middle border-b-2 border-b-violet-600 h-20">
          <Logo/>
          <div className="flex align-middle w-50 justify-between">
            <SearchIcon/>
            <CreatePostIcon/>
            <NotificationsAndProfile/>
          </div>
        </header>
        <main className="mt-22 h-full text-white">{children}</main>
      </body>
    </html>
  );
}
