import { useState, useEffect } from "react";
import "./Goals.css";

import { invoke } from "@tauri-apps/api/tauri";

function NewGoal({onSubmit, onEditing}) {

  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    onEditing(editing);
  }, [editing]);

  const onFocus = () => {
    // console.log('in focused');
  }
  const onBlur = () => {
    setEditing(false);
    // console.log('out of focused');
  }

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      if (text.length != 0) {
        onSubmit({ id: 0, text: text });
        setText("");
        // onEditing(false);
      } else {
        setEditing(false);
      }
    }
    if (editing && event.key === 'Escape') {
      // note: uncomment if you want to remove the text on Esc.
      // setText("");
      setEditing(false);
      // onEditing(false);
    }
  };

  const handleNewGoalClick = (event) => {
    setEditing(true);
    // console.log("button clicked:");
  };

  return (
    <div className="goal">
      {editing &&
        <input
          dir="auto"
          type="text"
          id="new-goal-input"
          autoFocus
          onFocus={onFocus}
          onBlur={onBlur}
          className="goal-text"
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          value={text}
          placeholder="Enter your new week goal..."
        />
      }
      {!editing &&
        <button
          type="button"
          className="btn-primary"
          onClick={handleNewGoalClick}
        >New Goal</button>
      }
    </div>
  );

}

function Goal({goal, onSubmit, onEditing, onGoalDelete}) {

  const [text, setText] = useState(goal.text);
  const [done, setDone] = useState(goal.done);

  const onCheckBoxChanged = () => {
    invoke("goal_checkbox_changed", { id: goal.id }).then((done_result) => {
      console.log(done_result);
      setDone(done_result);
    });
  }

  const handleGoalEdit = () => {
    console.log("handleGoalEdit");
  }

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
        onClick={() => {onGoalDelete(goal.id)}}
      >❌</button>
    </div>
  );
}

export default function GoalList({goals, onSubmit, onEditing, onGoalDelete}) {

  return (
    <div className="goal-list-container">
      {goals.map(goal =>
        <Goal
          key={goal.id}
          goal={goal}
          onSubmit={onSubmit}
          onEditing={onEditing}
          onGoalDelete={onGoalDelete}
        />
      )}
      <NewGoal onSubmit={onSubmit} onEditing={onEditing} />
    </div>
    );
}
