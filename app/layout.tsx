import type { Metadata } from "next";
import Head from "next/head";
import "./ui/global.css"
import Image from "next/image";
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
        <header className="fixed bg-[#141414] top-0 right-0 left-0 text-white p-4 flex justify-between align-middle border-b-2 border-b-violet-600">
          <Image src="/logo.svg" width={50} height={50} alt="Logo"/>
          <div className="flex align-middle w-50 justify-between">
            <Image src="/search.svg" width={25} height={25} alt="Search icon"/>
            <Image src="/new_post.svg" width={25} height={25} alt="Create new post icon"/>
            <Image src="/notifications.svg" width={25} height={25} alt="Notifications icon"/>
            <Image src="/default_profile.svg" width={25} height={25} alt="Profile picture"/>
          </div>
        </header>
        <main className="mt-22 h-full text-white">{children}</main>
      </body>
    </html>
  );
}
