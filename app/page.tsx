import { getUsers } from "./lib/db";
export default async function Home() {
  const users = await getUsers();
  return (
    <>
      <div>{users.map(user=>(
        <div key={user.id}>{user.username}</div>
      ))}</div>
      <p>Hi</p>
    </>
  );
}
