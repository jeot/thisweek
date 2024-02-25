import { useState } from "react";
import "./Goals.css";

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
        <input
          dir="auto"
          type="text"
          id="new-goal-input"
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          value={text}
          placeholder="Enter your new week goal..."
        />
      }
      {!editing &&
        <button
          type="button"
          className="btn-green"
          onClick={handleNewGoalClick}
        >Add Goal</button>
      }
    </div>
  );

}

function Goal({id, done, text, onSubmit, onEditing}) {

  // const [text, setText] = useState(data.text);

  return (
    <>
    <div className="goal">
      {done && <div>DONE</div>}
      {!done && <div>TODO</div>}
      <input
        dir="auto"
        onChange={(e) => { /* setText(e.currentTarget.value) */} }
        value={text}
        placeholder="Enter a goal..."
      />
    </div>
    </>
  );
}

export default function GoalList({goals, onSubmit, onEditing}) {

  return (
    <div className="goal-list-container">
      {goals.map(goal =>
        <Goal
          key={goal.id}
          id={goal.id}
          done={goal.done}
          text={goal.text}
          onSubmit={onSubmit}
          onEditing={onEditing}
        />
      )}
      <NewGoal onSubmit={onSubmit} onEditing={onEditing} />
    </div>
    );
}
