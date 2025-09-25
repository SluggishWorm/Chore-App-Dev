from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime, timedelta

app = FastAPI(title="Chore & Calendar API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Chore(BaseModel):
    id: int
    title: str
    assignee: str
    recurrence: Optional[str] = None  # "daily", "weekly"
    completed: bool = False
    due: Optional[datetime] = None

    # allow "2025-09-26T12:30" from datetime-local inputs
    @validator("due", pre=True)
    def parse_due(cls, v):
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except ValueError:
                try:
                    return datetime.strptime(v, "%Y-%m-%dT%H:%M")
                except ValueError:
                    return None
        return v


class Event(BaseModel):
    id: str
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
    all_events: List[Event] = []

    # include "manual" events
    all_events.extend(events)

    # convert chores with due dates into events
    for chore in chores:
        if chore.due:
            # base event
            all_events.append(Event(
                id=f"chore-{chore.id}",
                title=f"Chore: {chore.title}",
                start=chore.due,
                end=chore.due + timedelta(hours=1)
            ))

            # recurrence expansion
            if chore.recurrence and chore.recurrence.lower() == "daily":
                for i in range(1, 7):  # next 7 days
                    all_events.append(Event(
                        id=f"chore-{chore.id}-day{i}",
                        title=f"Chore: {chore.title} (recurring)",
                        start=chore.due + timedelta(days=i),
                        end=chore.due + timedelta(days=i, hours=1),
                    ))
            elif chore.recurrence and chore.recurrence.lower() == "weekly":
                for i in range(1, 4):  # next 3 weeks
                    all_events.append(Event(
                        id=f"chore-{chore.id}-week{i}",
                        title=f"Chore: {chore.title} (recurring)",
                        start=chore.due + timedelta(weeks=i),
                        end=chore.due + timedelta(weeks=i, hours=1),
                    ))

    return all_events
