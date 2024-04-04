import { useState, useEffect } from "react";
import GoalNoteItem from "./GoalNoteItem.tsx";

function WeekItemsList(props) {

  let item;
  let type;
  const item_elements = props.weekState.items.map((item) => {
    if ('Goal' in item) {
      item = item.Goal;
      type = "Goal";
    } else if ('Note' in item) {
      item = item.Note;
      type = "Note";
    } else
      return (<></>);

    return (
      <GoalNoteItem
        key={item.id}
        type={type}
        item={item}
        {...props} // it's passed by refference, so no big deal!
      />);
  });

  // console.log(item_elements);

  const new_goal_item = {id: 0, text: "", done: false};

  return (
    <>
    {item_elements}
    {props.startNewGoalEditing &&
      <GoalNoteItem
        key="0"
        type="NewGoal"
        item={{id: 0, text: "", done: true}}
        {...props} // it's passed by refference, so no big deal!
        />
    }
    </>
    );

}

export default function Week(props) {

  const [modifiable, setModifiable] = useState(true);

  const onLocalEdit = (e) => {
    console.log("onLocalEdit");
    if (e) {
      setModifiable(false);
    } else {
      setModifiable(true);
    }
    props.onEdit(e);
  }

  return (
    <div>
      <div className="week-title" dir="auto">
        {props.weekState.week_title}
      </div>

      <WeekItemsList
        modifiable={modifiable}
        onEdit={onLocalEdit}
        {...props}
      />

    </div>
    )
}
