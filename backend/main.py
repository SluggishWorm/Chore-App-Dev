from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

app = FastAPI(title="Chore & Calendar API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Chore(BaseModel):
    id: int
    title: str
    assignee: str
    recurrence: Optional[str] = None  # "daily", "weekly", etc.
    completed: bool = False
    due: Optional[datetime] = None    # NEW: due date

class Event(BaseModel):
    id: int
    title: str
    start: datetime
    end: datetime
    notes: Optional[str] = None

chores: List[Chore] = []
events: List[Event] = []

@app.get("/")
def root():
    return {"message": "Chore & Calendar API running"}

@app.get("/chores", response_model=List[Chore])
def get_chores():
    return chores

@app.post("/chores", response_model=Chore)
def create_chore(chore: Chore):
    chores.append(chore)
    return chore

@app.patch("/chores/{chore_id}/complete", response_model=Chore)
def complete_chore(chore_id: int):
    for chore in chores:
        if chore.id == chore_id:
            chore.completed = True
            return chore
    raise HTTPException(status_code=404, detail="Chore not found")

@app.get("/events", response_model=List[Event])
def get_events():
    chore_events = []
    for chore in chores:
        if chore.due:
            # add the base chore as an event
            chore_events.append(Event(
                id=chore.id,
                title=f"Chore: {chore.title}",
                start=chore.due,
                end=chore.due + timedelta(hours=1),  # 1hr block
            ))

            # recurrence expansion
            if chore.recurrence == "daily":
                for i in range(1, 7):
                    chore_events.append(Event(
                        id=int(f"{chore.id}{i}"),
                        title=f"Chore: {chore.title} (recurring)",
                        start=chore.due + timedelta(days=i),
                        end=chore.due + timedelta(days=i, hours=1),
                    ))
            elif chore.recurrence == "weekly":
                for i in range(1, 4):
                    chore_events.append(Event(
                        id=int(f"{chore.id}{i}"),
                        title=f"Chore: {chore.title} (recurring)",
                        start=chore.due + timedelta(weeks=i),
                        end=chore.due + timedelta(weeks=i, hours=1),
                    ))

    return events + chore_events
