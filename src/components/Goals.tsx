import { useState } from "react";
import "./Goals.css";

function NewGoal({onSubmit}) {

  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // setSubmitted(event.target.value);
      setText("");
      setSubmitted(text);
      onSubmit({ index: 0, text: text });
    }
  };

  return (
    <div className="goal">
      <input
        dir="auto"
        type="text"
        id="new-goal-input"
        onChange={(e) => setText(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        value={text}
        placeholder="Enter your new week goal..."
      />
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
