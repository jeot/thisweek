import { useState } from "react";
import "./Goals.css";

import { invoke } from "@tauri-apps/api/tauri";

function NewGoal({onSubmit, onEditing}) {

  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      setText("");
      setEditing(false);
      onEditing(false);
      onSubmit({ index: 0, text: text });
    }
    if (editing && event.key === 'Escape') {
      setText("");
      setEditing(false);
      onEditing(false);
    }
  };

  const handleNewGoalClick = (event) => {
    if (!editing) {
      setEditing(true);
      onEditing(true);
      setTimeout(() => {
          document.getElementById("new-goal-input").focus();
        }, 100)
    } else {
      setEditing(false);
      onEditing(false);
    }
    // console.log("button clicked: editing: ", editing);
  };

  return (
    <div className="goal">
      {editing &&
        <>
        <input
          type="checkbox"
          checked={false}
          onChange={() => {}}
        />
        <input
          dir="auto"
          type="text"
          id="new-goal-input"
          className="goal-text"
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          value={text}
          placeholder="Enter your new week goal..."
        />
        </>
      }
      {!editing &&
        <button
          type="button"
          className="btn-primary"
          onClick={handleNewGoalClick}
        >+</button>
      }
    </div>
  );

}

function Goal({goal, onSubmit, onEditing}) {
  // const [text, setText] = useState(data.text);
  const [text, setText] = useState(goal.text);
  const [done, setDone] = useState(goal.done);

  const onCheckBoxChanged = () => {
    invoke("goal_checkbox_changed", { id: goal.id }).then((done_result) => {
      console.log(done_result);
      setDone(done_result);
    });
  }

  const handleGoalEdit = () => {}
  const handleGoalDelete = () => {}

  return (
    <div className="goal" id={goal.id}>
      <input
        type="checkbox"
        checked={done}
        onChange={onCheckBoxChanged}
      />
      <input
        dir="auto"
        className="goal-text"
        onChange={(e) => { /* setText(e.currentTarget.value) */} }
        value={text}
        placeholder="Enter a goal..."
      />
      <button
        type="button"
        className="btn-goal-function"
        onClick={handleGoalEdit}
      >📝</button>
      <button
        type="button"
        className="btn-goal-function"
        onClick={handleGoalDelete}
      >❌</button>
    </div>
  );
}

export default function GoalList({goals, onSubmit, onEditing}) {

  return (
    <div className="goal-list-container">
      {goals.map(goal =>
        <Goal
          key={goal.id}
          goal={goal}
          onSubmit={onSubmit}
          onEditing={onEditing}
        />
      )}
      <NewGoal onSubmit={onSubmit} onEditing={onEditing} />
    </div>
    );
}
