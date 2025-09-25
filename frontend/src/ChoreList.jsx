import React, { useState, useEffect } from "react";

export default function ChoreList() {
  const [chores, setChores] = useState([]);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [due, setDue] = useState(""); // NEW: due date/time

  // Fetch chores
  useEffect(() => {
    fetch("http://localhost:8000/chores")
      .then((res) => res.json())
      .then((data) => setChores(data));
  }, []);

  // Add a new chore
  const addChore = async (e) => {
    e.preventDefault();
    const newChore = {
      id: chores.length + 1, // simple incremental ID
      title,
      assignee,
      recurrence,
      due: due || null, // NEW: pass due date
      completed: false,
    };

    const res = await fetch("http://localhost:8000/chores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChore),
    });

    if (res.ok) {
      const data = await res.json();
      setChores([...chores, data]);
      setTitle("");
      setAssignee("");
      setRecurrence("");
      setDue(""); // clear after submit
    }
  };

  // Mark chore complete
  const completeChore = async (id) => {
    const res = await fetch(`http://localhost:8000/chores/${id}/complete`, {
      method: "PATCH",
    });

    if (res.ok) {
      const updated = await res.json();
      setChores(chores.map((c) => (c.id === id ? updated : c)));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chore List</h2>

      <form onSubmit={addChore} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Chore title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Recurrence (daily, weekly...)"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
        />
        <input
          type="datetime-local"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button type="submit">Add Chore</button>
      </form>

      <ul>
        {chores.map((chore) => (
          <li key={chore.id}>
            <label>
              <input
                type="checkbox"
                checked={chore.completed}
                onChange={() => completeChore(chore.id)}
              />
              {chore.title} — {chore.assignee}{" "}
              {chore.recurrence ? `(${chore.recurrence})` : ""}{" "}
              {chore.due ? `— Due: ${new Date(chore.due).toLocaleString()}` : ""}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
