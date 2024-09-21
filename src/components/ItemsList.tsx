import { ItemView } from "../my_types";
import GoalNoteItem from "./GoalNoteItem";

export default function ItemsList(props: any) {
  const item_elements = props.items.map((item: ItemView, i: number) => {
    const editing = (item.id == props.editingId);
    const selected = (item.id == props.selectedId);

    return (
      <GoalNoteItem
        key={item.id}
        item={item}
        editing={editing}
        selected={selected}
        {...props} // it's passed by refference, so no big deal!
      />);
  });

  return (
    <div id="items-list-id" className="items-list">
      {item_elements}
    </div>
  );

}
