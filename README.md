# Smart Task Manager Pro

A production-level full-stack Task Management Web Application built with the MERN stack. Features a modern SaaS-style UI, JWT authentication, real-time updates via Socket.io, drag-and-drop Kanban board, and Chart.js analytics.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router, Chart.js, Socket.io-client, @hello-pangea/dnd
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.io
- **Styling:** Tailwind CSS with glassmorphism dark theme

## Features

- JWT-based authentication (register/login)
- Full CRUD for tasks
- Kanban drag-and-drop board (Pending → In Progress → Completed)
- Grid and Kanban view toggle
- Task filtering by status, search by title, sort by priority/date
- Dashboard with Chart.js analytics (Doughnut + Bar charts)
- Statistics cards (Total, Pending, Completed, Overdue)
- Real-time updates via Socket.io
- Task priority color coding (High/Medium/Low)
- Due date with overdue and due-soon indicators
- Tags support
- Profile page with completion rate progress bar
- Settings page
- Fully responsive (mobile + desktop)
- Toast notifications
- Glassmorphism dark UI

## Project Structure

```
Task/
├── server/                 # Node.js + Express backend
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── client/                 # React.js frontend
    ├── src/
    │   ├── components/
    │   │   ├── layout/     # Navbar, Sidebar, Layout
    │   │   ├── tasks/      # TaskCard, TaskForm
    │   │   └── ui/         # Loader, Modal, StatsCard, EmptyState
    │   ├── context/        # AuthContext, TaskContext
    │   ├── pages/          # Login, Register, Dashboard, Tasks, Profile, Settings
    │   ├── utils/          # api.js (axios), helpers.js
    │   └── App.js
    ├── .env
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Task
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-task-manager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm start
```

### 4. Open in browser
Navigate to `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/tasks | Get all user tasks | Yes |
| POST | /api/tasks | Create new task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |
| GET | /api/tasks/stats | Get task statistics | Yes |

## Screenshots

- **Login Page** — Modern glassmorphism card with gradient background
- **Dashboard** — Stats cards + Chart.js analytics + recent tasks
- **Tasks (Grid View)** — Filtered task cards with priority/status badges
- **Tasks (Kanban View)** — Drag-and-drop board with 3 columns
- **Profile** — User stats and completion rate
- **Settings** — Toggle preferences

## License
MIT
