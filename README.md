# LeetCode Tracker Dashboard

A real-time LeetCode profile tracker dashboard. Paste any LeetCode profile URL and watch live stats populate — solved counts, rankings, contest ratings, and more.

## Features

- **Real-time tracking** — auto-refreshes every 60 seconds via React Query polling
- **Add profiles by URL** — extracts username automatically from any LeetCode URL
- **Bulk import** — paste multiple URLs or upload a CSV
- **Sortable table** — click any column header to sort
- **Debounced search** — filter by username instantly
- **Virtualized rendering** — handles 500+ profiles smoothly
- **Dark mode** — toggle with one click, persisted to localStorage
- **Export CSV** — download all tracked data
- **Stats cards** — total solved, avg acceptance, top performer, contest leader
- **Delete with confirmation** — modal guard before removal
- **Persistent storage** — profiles survive browser refresh

---

## Project Structure

```
LeetView/
├── client/          # React + TypeScript + Vite frontend
└── server/          # Node.js + Express + TypeScript backend
```

---

## Setup

### Prerequisites

- Node.js 18+
- npm 9+

---

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Server starts at **http://localhost:3001**

**Environment variables** (`.env`):
```
PORT=3001
LEETCODE_GRAPHQL_URL=https://leetcode.com/graphql
CACHE_TTL_SECONDS=30
```

---

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App opens at **http://localhost:5173**

> The Vite dev server proxies `/api/*` requests to `http://localhost:3001` automatically.

---

## API

### `GET /api/profile/:username`

Returns LeetCode stats for a user.

**Example:**
```
GET http://localhost:3001/api/profile/neal_wu
```

**Response:**
```json
{
  "username": "neal_wu",
  "ranking": 1,
  "totalSolved": 850,
  "easySolved": 250,
  "mediumSolved": 400,
  "hardSolved": 200,
  "totalSubmissions": 1200,
  "acceptanceRate": 70.8,
  "contestRating": 3800,
  "fetchedAt": "2026-06-07T10:00:00.000Z"
}
```

**Errors:**
- `404` — user not found
- `429` — rate limited
- `503` — LeetCode API unreachable

---

## Sample Test Profiles

```
https://leetcode.com/u/neal_wu/
https://leetcode.com/u/tourist/
https://leetcode.com/u/jiangly/
```

---

## Bulk Import CSV Format

```csv
profile_url
https://leetcode.com/u/user1/
https://leetcode.com/u/user2/
https://leetcode.com/u/user3/
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn-style custom components |
| Data Table | TanStack Table v8 |
| Virtualization | TanStack Virtual |
| Data Fetching | TanStack Query v5 (React Query) |
| Icons | Lucide React |
| Backend | Node.js, Express, TypeScript |
| API | LeetCode public GraphQL |

---

## License

MIT