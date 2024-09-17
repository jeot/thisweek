import { useState, useEffect, useRef, createRef } from "react";

import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatIcon from '@mui/icons-material/Chat';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { getDirection } from "../utilities.ts"
import { ItemKind, ItemStatus } from "../constants.ts";

import type { ItemView } from "../my_types.ts";
import ObjectivesPopover from "./ObjectivesPopover.tsx";

/**
 * Method to scroll into view port, if it's outside the viewport
 *
 * @param {Object} target - DOM Element
 * @returns {undefined}
 */
const scrollIntoViewIfNeeded = (target: HTMLElement) => {
  const itemTop = target.getBoundingClientRect().top;
  // console.log("top", itemTop);
  const itemBot = target.getBoundingClientRect().bottom;
  // console.log("bot", itemBot);
  // console.log("window inner height", window.innerHeight);
  // console.log("window inner width", window.innerWidth);
  // console.log("doc height", document.documentElement.clientHeight);
  // console.log("doc width", document.documentElement.clientWidth);
  // Target is outside the viewport from the bottom
  const itemsBoxTop = document.getElementById("items-list-id")?.getBoundingClientRect().top;
  const itemsBoxBot = document.getElementById("items-list-id")?.getBoundingClientRect().bottom;
  // console.log(itemsBoxTop, itemsBoxBot);
  if (itemBot > itemsBoxBot) {
    //  The bottom of the target will be aligned to the bottom of the visible area of the scrollable ancestor.
    // target.scrollIntoView(false);
    // console.log("scrollIntoView bottom");
    target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  // Target is outside the view from the top
  if (itemTop < itemsBoxTop) {
    // The top of the target will be aligned to the top of the visible area of the scrollable ancestor
    // target.scrollIntoView();
    // console.log("scrollIntoView top");
    target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
};

function GoalNoteItem(props: any) {
  const { editing, selected, onSubmit, onEdit, onSelect, onDelete, onCancel, onToggle, onCopyText, onFocusLeave, onObjectiveTypeChanged } = props;

  if (props.item === null || props.item === undefined) {
    console.log("item null");
    return;
  }

  const itemRef = useRef<null | React.RefObject<unknown>>(null);

  const [editingItem, setEditingItem] = useState<ItemView>(props.item);

  useEffect(() => {
    // console.log("item did mount");
    return () => { /* console.log("item unmounted"); */ };
  }, []);

  const fixedText = props.item.text ?? "ERROR! INVALID TEXT";
  const editingText = editingItem.text ?? "ERROR! INVALID TEXT";
  const statusFixed = props.item.status ?? false;
  const statusEditing = editingItem.status ?? false;
  const objTagFixed = props.item.objective_tag;
  const objTagEditing = editingItem.objective_tag;
  let status = editing ? statusEditing : statusFixed;
  let id = editing ? editingItem.id : props.item.id;
  let kind = editing ? editingItem.kind : props.item.kind;
  let dir = editing ? getDirection(editingText) : getDirection(fixedText);
  const objective_tag = editing ? objTagEditing : objTagFixed;

  useEffect(() => {
    if (selected) {
      // console.log(itemRef.current);
      scrollIntoViewIfNeeded(itemRef.current);
    }
  }, [selected]);

  useEffect(() => {
    if (editing) {
      setEditingItem(props.item);
    }
  }, [editing]);

  const onFocus = () => { }

  const onBlur = () => {
    onFocusLeave({ id: id, text: editingText });
  }

  const setEditingItemText = function(text: string) {
    setEditingItem({
      ...editingItem,
      title: (editingItem.kind === ItemKind.goal) ? text : null,
      note: (editingItem.kind === ItemKind.note) ? text : null,
    });
  }
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event: any) => {
    if (editing && event.key === 'Enter' && event.shiftKey && kind == ItemKind.note) {
      if (editingText == "") onCancel(id);
      else {
        /* here input field will automatically insert a new line! */
      }
    } else if (editing && event.key === 'Enter') {
      if (editingText == "") onCancel(id);
      else {
        onSubmit({ item: editingItem, keyboard_submit: true });
        setEditingItemText("");
      }
    } else if (editing && event.key === 'Escape') {
      onCancel(id);
      setEditingItemText("");
    } else { }
  };

  const handleObjectiveTypeChange = function(year: number, season: number | null, month: number | null) {
    if (editing) {
      setEditingItem({
        ...editingItem,
        year: year,
        season: season,
        month: month,
      });
    } else {
      onObjectiveTypeChanged(id, year, season, month);
    }

  }

  const onCheckBoxChanged = () => {
    if (editing) {
      setEditingItem({
        ...editingItem,
        status: editingItem.status == ItemStatus.done ? ItemStatus.undone : ItemStatus.done,
      });
    } else {
      onToggle(id);
    }
  }

  const style_item = `item ${selected ? "item-selected" : ""} ${kind == ItemKind.goal ? "item-goal" : "item-note"}`;
  const style_input = `item-input ${kind == ItemKind.goal ? "item-input-goal" : "item-input-note"}`;
  const inputPropsStyle = function(itemkind: number) {
    return {
      fontSize: (itemkind == ItemKind.note) ? "0.85em" : "1em",
      fontWeight: (itemkind == ItemKind.note) ? 300 : 400,
      caretColor: editing ? "visible" : "transparent",
    }
  }

  return (
    <Box
      ref={itemRef}
      dir="rtl"
      id={id}
      className={style_item}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={0}
      >
        {(kind == ItemKind.goal) &&
          <Checkbox
            checked={status}
            onChange={onCheckBoxChanged}
            size="small"
          />
        }
        {(kind == ItemKind.note) &&
          <IconButton aria-label="note" size="small" disabled color="secondary" >
            <ChatIcon color="warning" />
            {/*<ChatIcon color="inherit" />*/}
          </IconButton>
        }
        {editing &&
          <>
            <TextField
              dir={dir}
              variant="outlined"
              size="small"
              className={style_input}
              inputProps={{ style: inputPropsStyle(kind) }}
              multiline={(kind == ItemKind.note)}
              maxRows={(kind == ItemKind.note) ? 40 : 1}
              fullWidth
              autoFocus
              onFocus={onFocus}
              onBlur={onBlur}
              value={editingText}
              onKeyDown={handleKeyDown}
              onChange={(e) => setEditingItemText(e.currentTarget.value)}
            />
            <ObjectivesPopover
              objective_tag={objective_tag}
              onChange={handleObjectiveTypeChange}
            />
            <IconButton
              aria-label="ok"
              size="small"
              color="success"
              onClick={() => {
                let item = editingItem;
                if (kind == ItemKind.goal) item.title = editingText;
                if (kind == ItemKind.note) item.note = editingText;
                onSubmit({ item: item, keyboard_submit: false });
                setEditingItemText("");
              }}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="cancel"
              size="small"
              color="default"
              onClick={() => {
                onCancel(id);
                setEditingItemText("");
              }}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </>
        }
        {!editing &&
          <>
            <InputBase
              dir={dir}
              size="small"
              className={style_input}
              inputProps={{ style: inputPropsStyle(kind) }}
              multiline={(kind == ItemKind.note)}
              maxRows={(kind == ItemKind.note) ? 40 : 1}
              fullWidth
              value={fixedText}
              onMouseDown={() => { onSelect(id); }}
            />
            <ObjectivesPopover
              objective_tag={objective_tag}
              onChange={handleObjectiveTypeChange}
            />
            <IconButton
              aria-label="copy"
              size="small"
              color="secondary"
              onClick={() => { onCopyText(id) }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="edit"
              size="small"
              color="primary"
              onClick={() => {
                onEdit(id);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              color="error"
              onClick={() => { onDelete(id) }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        }
      </Stack>
    </Box>
  );
}

export default GoalNoteItem;
