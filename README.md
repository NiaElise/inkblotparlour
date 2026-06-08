# Inkblot Parlour

A nostalgic, literary social sanctuary for fiction architects.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js server (running via `tsx`)
- **Database**: SQLite (synced via `team-db` / Turso)
- **Persistence**: Full persistence for social feed, storyworlds, characters, lore, tension maps, and timelines.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Running the Application

To run both the frontend and the backend simultaneously:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5174` (or your assigned port).
The backend API runs on `http://localhost:3001`.

### Individual Services

- **Frontend Only**: `npm run build` then `npm run preview`
- **Backend Only**: `npm run server`

## Deployment

1. **Connect to GitHub**: Push this repository to GitHub.
2. **Choose a Host**: Render, Railway, or Fly.io are recommended for full-stack Node.js applications.
3. **Set Environment Variables**: Ensure `PORT` and any database credentials (if moving off team-db) are set.
4. **Build Step**: The build command is `npm run build`.
5. **Start Step**: The start command is `npm run server`.

## License

Refer to the Covenant (Terms of Service) and Privacy Pact within the application.
