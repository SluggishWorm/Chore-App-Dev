from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Chore & Calendar API")

# --- CORS middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Chore(BaseModel):
    id: int
    title: str
    assignee: str
    recurrence: Optional[str] = None
    completed: bool = False

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
    return events

@app.post("/events", response_model=Event)
def create_event(event: Event):
    events.append(event)
    return event
