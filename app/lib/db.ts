import postgres from "postgres";

const sql = postgres({
    host: "localhost",
    user: "daniil",
    database: "reddit_clone",
    password: "332107",
    port: 5432
});

export async function getUsers() {
    const users = await sql`
    SELECT * FROM users;
    `
    return users;
}