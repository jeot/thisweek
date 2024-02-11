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
    // </form>
  );
}

export default function GoalList({goals, onSubmit}) {

  const item = (data, index) => <Goal data={data} index={index} onSubmit={onSubmit} />;

  return (
    <div className="goal-list-container">
      {goals.map(item)}
    </div>
    );

}
