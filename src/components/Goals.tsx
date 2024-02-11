import { useState } from "react";
import "./Goals.css";

function Goal({data, index, onSubmit}) {

  const [text, setText] = useState(data.text);

  return (
    // <form
    //   className="row"
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //     console.log("goal submit");
    //   }}
    // >
    <>
    <div className="goal">
      <span>{index}</span>
      <input
        dir="auto"
        id={data.id}
        onChange={(e) => setText(e.currentTarget.value)}
        value={text}
        placeholder="Enter a goal..."
      />
    </div>
    </>
    // </form>
  );
}

export default function GoalList({goals, onSubmit}) {

  const item = (data, index) => <Goal data={data} index={index} onSubmit={onSubmit} />;

  return (
    <div>
      {goals.map(item)}
    </div>
    );

}
