import { Page } from "../constants";
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
        index={i}
        {...props} // it's passed by refference, so no big deal!
      />);
  });

  const empty: boolean = item_elements.length == 0;
  let style: string = !empty ? "items-list" : "items-list items-list-empty";
  style = style + (props.page == Page.weeks ? " items-list-week" :
    props.page == Page.objectives ? " items-list-year" : "");
  console.log(style);

  return (
    <>
      <div id="items-list-id" className={style}> {item_elements} </div>
    </>
  );

}
