# Reddit Clone App

A full-stack Reddit-inspired web application built for learning purposes.

---

🌐 Live Demo:

https://reddit-clone-liard-delta.vercel.app/


## ✨ Features

- 🔐 User authentication (Sign up / Log in)
- 📝 Create and read posts
- 💬 Add comments and nested replies
- 🔼 Upvote/downvote posts and comments
- 🔎 Search posts by title/content
- 🔔 Notifications for comments
- 👤 Edit profile (username, profile image)

---

## 🛠️ Tech Stack

| Layer       | Technology     |
|-------------|----------------|
| Frontend    | Next.js (App Router, Server Actions) |
| Backend     | PostgreSQL     |
| Hosting     | Vercel (frontend) + Neon (database)  |

---

## 🗂️ Project Structure
Createpost, login, notifications, post, search, settings, signup user folders and /app/page.tsx -- pages
lib folder contains all server actions
ui folder contains tsx components that are used in pages
public folder contains  svg icons

---

## 🧱 Database Schema

### `users`

| Column           | Type     | Description                |
|------------------|----------|----------------------------|
| `id`             | INTEGER  | Primary key                |
| `email`          | TEXT     | Unique, not null           |
| `username`       | VARCHAR  | Unique, not null           |
| `password`       | TEXT     | Hashed password            |
| `profile_img_url`| TEXT     | URL of profile image       |

---

### `posts`

| Column       | Type      | Description                              |
|--------------|-----------|------------------------------------------|
| `id`         | INTEGER   | Primary key                              |
| `author_id`  | INTEGER   | FK → users(id), not null                 |
| `title`      | TEXT      | Not null                                 |
| `text`       | TEXT      | Optional post body                       |
| `image_url`  | TEXT      | Optional image                           |
| `created_at` | TIMESTAMP | Default: `NOW()`                         |

---

### `comments`

| Column      | Type      | Description                                  |
|-------------|-----------|----------------------------------------------|
| `id`        | INTEGER   | Primary key                                  |
| `author_id` | INTEGER   | FK → users(id), not null                     |
| `post_id`   | INTEGER   | FK → posts(id), not null                     |
| `parent_id` | INTEGER   | Optional FK → comments(id) (nested replies)  |
| `body`      | TEXT      | Not null                                     |
| `created_at`| TIMESTAMP | Default: `NOW()`                             |

---

### `post_votes`

| Column     | Type     | Description                     |
|------------|----------|---------------------------------|
| `id`       | INTEGER  | Primary key                     |
| `post_id`  | INTEGER  | FK → posts(id), not null        |
| `user_id`  | INTEGER  | FK → users(id), not null        |
| `vote`     | BOOLEAN  | `true` for upvote, `false` down |

---

### `comment_votes`

| Column       | Type     | Description                      |
|--------------|----------|----------------------------------|
| `id`         | INTEGER  | Primary key                      |
| `comment_id` | INTEGER  | FK → comments(id), not null      |
| `user_id`    | INTEGER  | FK → users(id), not null         |
| `vote`       | BOOLEAN  | `true` for upvote, `false` down  |

---

### `notifications`
| Column        | Type      | Description                                          |
| ------------- | --------- | ---------------------------------------------------- |
| `id`          | INTEGER   | Primary key (auto-increment identity)                |
| `post_id`     | INTEGER   | FK → posts(id), not null                             |
| `author_id`   | INTEGER   | FK → users(id), not null (who performed action)      |
| `receiver_id` | INTEGER   | FK → users(id), not null (who receives notification) |
| `comment_id`  | INTEGER   | Optional FK → comments(id)                           |
| `is_read`     | BOOLEAN   | Not null, whether notification was read              |
| `created_at`  | TIMESTAMP | Default: `NOW()`                                     |

## 🚀 Hosting

- **Frontend:** [Vercel](https://vercel.com)
- **Database:** [Neon](https://neon.tech)

---

## 📌 Notes

This project is not intended for production use — it's a learning experiment exploring full-stack concepts with Next.js and PostgreSQL.
