# 🗓️ Chore & Calendar App

A self-hosted **calendar + chore tracker** built with **FastAPI** (backend) and **React + FullCalendar** (frontend). Add chores with assignees, due dates, and recurrence, and see them on a week/day calendar. Runs locally with Docker Compose.

---

## ✨ Features
- FastAPI API for **chores** and **events**
- React + FullCalendar **week/day views**
- Add chores with **title, assignee, recurrence, due date/time**
- **Recurring chores** (daily/weekly) auto-expand into future calendar events
- **Dark/Light mode** + user prefs (week start: Sun/Mon, 12h/24h time)
- **Live calendar refresh** (polling)
- One command startup with **Docker Compose**

---

## 🧱 Project Structure
    .
    ├─ backend/
    │  ├─ main.py
    │  ├─ requirements.txt
    │  └─ Dockerfile
    ├─ frontend/
    │  ├─ src/
    │  │  ├─ App.js
    │  │  ├─ CalendarView.jsx
    │  │  ├─ ChoreList.jsx
    │  │  ├─ LaunchPage.jsx
    │  │  └─ calendar.css
    │  ├─ package.json
    │  └─ Dockerfile
    ├─ docker-compose.yml
    └─ README.md

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Run the whole stack
    docker compose up --build

- Backend: http://localhost:8000  
- Frontend: http://localhost:3000  

Stop:
    docker compose down

> If port 3000/8000 is in use, stop the other process or change the port mapping in `docker-compose.yml`.

---

## 🔌 API (FastAPI)

Base URL: `http://localhost:8000`

| Method | Path                      | Description                      |
|-------:|---------------------------|----------------------------------|
| GET    | `/`                       | Health message                   |
| GET    | `/chores`                 | List chores                      |
| POST   | `/chores`                 | Create chore                     |
| PATCH  | `/chores/{id}/complete`   | Mark chore complete              |
| GET    | `/events`                 | Events (manual + from chores)    |

### Chore schema (request/response)
    {
      "id": 1,
      "title": "Take out trash",
      "assignee": "Alice",
      "recurrence": "daily",
      "due": "2025-09-27T19:00",
      "completed": false
    }

### Notes
- `GET /events` returns:
  - Any manually created events (if you add that later), **plus**
  - Generated events from chores with a `due`:
    - base event at `due`
    - daily: next 6 days
    - weekly: next 3 weeks

---

## 🖥️ Frontend (React)

- **CalendarView.jsx**
  - Fetches `/events` and shows week/day using FullCalendar
  - Auto-refreshes every few seconds
  - Honors prefs: week start (Sun/Mon), 12h/24h time, dark mode

- **ChoreList.jsx**
  - Add chores (title, assignee, recurrence, **due date/time**)
  - Mark complete
  - Shows `Due: …` when provided

- **LaunchPage.jsx**
  - Set initial preferences (date format, time format, week start, dark mode)
  - Saved in `localStorage`

---

## ⚙️ Development Tips

### Rebuild only backend
    docker compose up --build backend

### Live reload
- Backend runs `uvicorn --reload`
- Frontend runs `npm start` inside the container
- Source is volume-mounted (`./backend:/app`, `./frontend:/app`) so edits reflect automatically

### CORS
Backend allows:
    allow_origins = ["http://localhost:3000", "http://localhost:3001"]

---

## 🧪 Example Workflows

### Add a chore that appears on the calendar
1. Open http://localhost:3000
2. In **ChoreList**, add:
   - Title: “Vacuum”
   - Assignee: “Sam”
   - Recurrence: “daily”
   - Due: pick date/time
3. Calendar shows “Chore: Vacuum” at that time + next 6 days

### Mark a chore complete
- Click the checkbox next to the chore in **ChoreList** or call:
    PATCH /chores/1/complete

---

## 🗺️ Roadmap
- [ ] Database persistence (SQLite/Postgres instead of in-memory)
- [ ] ICS/iCal (Apple/Google) sync
- [ ] Notifications/reminders
- [ ] Single account with multi-assignee UX improvements
- [ ] Month view (optional)
- [ ] Docker image hardening & CI pipeline

---

## 🧾 License
This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.  
You are free to use and modify it, but **commercial use is not allowed**.  

See the full license text here: [LICENSE](LICENSE).
