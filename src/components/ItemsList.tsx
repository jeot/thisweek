import { Item } from "../my_types";
import GoalNoteItem from "./GoalNoteItem";

export default function ItemsList(props: any) {
  const item_elements = props.items.map((item: Item, i: number) => {
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

      {props.newItem ? <GoalNoteItem
        key={'new_item_key'}
        item={props.newItem}
        editing={true}
        selected={false}
        {...props}
      /> : <></>}
    </div>
  );

}
