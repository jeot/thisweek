import { useEffect, useState } from "react";
import { Page } from "../constants";
import { ItemView } from "../my_types";
import GoalNoteItem from "./GoalNoteItem";
import { DragDropContext, Droppable, DroppableProps, Draggable, DropResult } from 'react-beautiful-dnd';


interface ItemsListProps {
  items: ItemView[];
  editingId?: number;
  selectedId?: number;
  page: Page;
  config: any;
  onEditSubmit: (id: number, text: string) => void;
  onEdit: (id: number) => void;
  onSelect: (id: number) => void;
  onToggleSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  onToggle: (id: number) => void;
  onCopyText: (id: number) => void;
  onFocusLeave: () => void;
  onObjectiveTypeChanged: (id: number, year: number, season: number | null, month: number | null) => void;
  onDragAndDropEnd: (srcIndex: number, destIndex: number) => void;
}

// fixing issue patch:
// https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};


export default function ItemsList(props: ItemsListProps) {
  const [listStyle, setListStyle] = useState('');

  useEffect(() => {
    const empty: boolean = props.items.length == 0;
    let style: string = !empty ? "items-list" : "items-list items-list-empty";
    style = style + (props.page == Page.weeks ? " items-list-week" :
      props.page == Page.objectives ? " items-list-year" : "");
    setListStyle(style);
  }, [props.items.length, props.page]);


  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    props.onDragAndDropEnd(result.source.index, result.destination.index);

    // const items = Array.from(yourItemsArray);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);
    // setYourItemsArray(items); // Update your state with the new order
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppable-items">
        {(provided) => (
          <div
            className={listStyle}
            {...provided.droppableProps}
            ref={provided.innerRef}
          // style={{ border: snapshot.isDraggingOver ? 'solid 1px' : 'none' }}
          >
            {props.items.map((item: ItemView, index: number) => {
              const editing = (item.id == props.editingId);
              const selected = (item.id == props.selectedId);

              return (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style, // Apply default styles
                        // Add your custom styles here
                        // backgroundColor: snapshot.isDragging ? 'lightgray' : 'white',
                        // border: snapshot.isDragging ? 'solid black 1px' : 'none',
                        // boxShadow: snapshot.isDragging ? '0px 0px 35px -10px rgba(0, 0, 0, 0.5)' : 'none',

                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                    >
                      <GoalNoteItem
                        item={item}
                        editing={editing}
                        selected={selected}
                        index={index}
                        onEditSubmit={props.onEditSubmit}
                        onEdit={props.onEdit}
                        onSelect={props.onSelect}
                        onToggleSelect={props.onToggleSelect}
                        onDelete={props.onDelete}
                        onCancel={props.onCancel}
                        onToggle={props.onToggle}
                        onCopyText={props.onCopyText}
                        onFocusLeave={props.onFocusLeave}
                        onObjectiveTypeChanged={props.onObjectiveTypeChanged}
                        config={props.config}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );

}
