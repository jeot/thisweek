import { useState, useEffect } from "react";
import GoalNoteItem from "./GoalNoteItem.tsx";

function WeekItemsList(props) {

  let item;
  let type;
  const item_elements = props.weekState.items.map((item) => {
    if ('Goal' in item) {
      item = item.Goal;
      type = 'Goal';
    } else if ('Note' in item) {
      item = item.Note;
      type = 'Note';
    } else
      return (<></>);

    let editing = (item.id == 'new_goal_id' || item.id == 'new_note_id' || item.id == props.editingId);
    return (
      <GoalNoteItem
        key={item.id}
        type={type}
        id={item.id}
        text={item.text}
        done={item.done}
        editing={editing}
        {...props} // it's passed by refference, so no big deal!
      />);
  });

  // console.log(item_elements);

  const new_goal_item = {id: 0, text: "", done: false};

  return (
    <>
    {item_elements}
    {(props.editingId == 'new_goal_id') &&
      <GoalNoteItem
        key={'new_goal_id'}
        type={'Goal'}
        id={'new_goal_id'}
        text={""}
        done={false}
        editing={true}
        {...props}
      />
    }
    {(props.editingId == 'new_note_id') &&
      <GoalNoteItem
        key={'new_note_id'}
        type={'Note'}
        id={'new_note_id'}
        text={""}
        done={false}
        editing={true}
        {...props}
      />
    }
    </>
    );

}

export default function Week(props) {

  return (
    <div>
      <div className="week-title" dir="auto">
        {props.weekState.week_title}
      </div>

      <WeekItemsList
        {...props}
      />

    </div>
    );

}
