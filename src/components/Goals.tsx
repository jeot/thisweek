import { useState } from "react";
import "./Goals.css";

function NewGoal({onSubmit}) {

  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      setText("");
      setEditing(false);
      onSubmit({ index: 0, text: text });
    }
    if (editing && event.key === 'Escape') {
      setText("");
      setEditing(false);
    }
  };

  const handleNewGoalClick = (event) => {
    if (!editing) { 
      setEditing(true);
      setTimeout(() => {
          document.getElementById("new-goal-input").focus();
        }, 100)
    } else {
      setEditing(false);
    }
    console.log("button clicked: editing: ", editing);
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

function Goal({data, index, onSubmit}) {

  const [text, setText] = useState(data.text);

  return (
    <>
    <div className="goal">
      <span>{index}</span>
      {data.done && <div>done</div>}
      {!data.done && <div>todo</div>}
      <input
        dir="auto"
        id={index}  /* {data.id} */
        onChange={(e) => setText(e.currentTarget.value)}
        value={text}
        placeholder="Enter a goal..."
      />
    </div>
    </>
  );
}

export default function GoalList({goals, onSubmit}) {

  const item = (data, index) => <Goal data={data} index={index} onSubmit={onSubmit} />;

  return (
    <div className="goal-list-container">
      {goals.map(item)}
      <NewGoal onSubmit={onSubmit} />
    </div>
    );

}
