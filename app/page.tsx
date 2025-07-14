import { getUsers } from "./lib/db";
export default async function Home() {
  const users = await getUsers();
  return (
    <>
      <p>Hi</p>
    </>
  );
}
