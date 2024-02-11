import { useState } from "react";

function Goal({data, onSubmit}) {

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
      <input
        dir="auto"
        id={data.id}
        onChange={(e) => setText(e.currentTarget.value)}
        value={text}
        placeholder="Enter a goal..."
      />
    </>
    // </form>
  );
}

export default function GoalList({goals, onSubmit}) {

  const item = (data) => <Goal data={data} onSubmit={onSubmit} />;

  return (
    <div>
      {goals.map(item)}
    </div>
    );

}
