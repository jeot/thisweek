import GoalNoteItem from "./GoalNoteItem";
import { ids, itemKind, itemStatus } from "./../constants.ts";

export default function ItemsList(props) {
  const item_elements = props.items.map((item, i) => {
    let editing = (item.id == props.editingId);
    let selected = (item.id == props.selectedId);

    return (
      <GoalNoteItem
        ref={props.itemsRefs.current[i]}
        key={item.id}
        item={item}
        editing={editing}
        selected={selected}
        {...props} // it's passed by refference, so no big deal!
      />);
  });
  // console.log(item_elements);

  return (
    <div className="items-list">
      {item_elements}
      {
        (props.editingId == ids.new_goal) &&
        <GoalNoteItem
          key={'new_goal_key'}
          item={{ id: ids.new_goal, kind: itemKind.goal, title: "", note: "", status: itemStatus.undone }}
          editing={true}
          selected={false}
          {...props}
        />
      }
      {
        (props.editingId == ids.new_note) &&
        <GoalNoteItem
          key={'new_note_key'}
          item={{ id: ids.new_note, kind: itemKind.note, title: "", note: "", status: itemStatus.undone }}
          editing={true}
          selected={false}
          {...props}
        />
      }
    </div>
  );

}
