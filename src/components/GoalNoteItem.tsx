import { useState, useEffect } from "react";

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

import { getDirection, toPersianDigits } from "../utilities.ts"
import { ObjectiveType, ItemKind, ItemStatus } from "../constants.ts";

import { forwardRef } from 'react';
import type { Item } from "../my_types.ts";

/**
 * Method to scroll into view port, if it's outside the viewport
 *
 * @param {Object} target - DOM Element
 * @returns {undefined}
 */
const scrollIntoViewIfNeeded = (target: HTMLElement) => {
  // Target is outside the viewport from the bottom
  if (target.getBoundingClientRect().bottom > window.innerHeight) {
    //  The bottom of the target will be aligned to the bottom of the visible area of the scrollable ancestor.
    // target.scrollIntoView(false);
    target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  // Target is outside the view from the top
  if (target.getBoundingClientRect().top < 0) {
    // The top of the target will be aligned to the top of the visible area of the scrollable ancestor
    // target.scrollIntoView();
    target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
};

// export default function GoalNoteItem({ item, editing, selected, onSubmit, onEdit, onSelect, onDelete, onCancel, onToggle, onCopyText, onFocusLeave }) {
const GoalNoteItem = forwardRef(function GoalNoteItem(props: any, ref: any) {
  const { editing, selected, onSubmit, onEdit, onSelect, onDelete, onCancel, onToggle, onCopyText, onFocusLeave } = props;

  if (props.item === null || props.item === undefined) {
    console.log("item null");
    return;
  }

  const [editingItem, setEditingItem] = useState(props.item);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
  }, []);

  const temp1 = (props.item.kind === ItemKind.goal) ? props.item.title
    : (props.item.kind === ItemKind.note) ? props.item.note : "ERROR!";
  const fixedText = temp1 ?? "ERROR! INVALID TEXT";
  // console.log("editingItem", editingItem);
  const temp2 = (editingItem.kind === ItemKind.goal) ? editingItem.title
    : (editingItem.kind === ItemKind.note) ? editingItem.note : "ERROR!";
  const editingText = temp2 ?? "ERROR! INVALID TEXT";
  const statusFixed = props.item.status === ItemStatus.undone ? false :
    props.item.status === ItemStatus.done ? true : false;
  const statusEditing = editingItem.status === ItemStatus.undone ? false :
    editingItem.status === ItemStatus.done ? true : false;
  let status = editing ? statusEditing : statusFixed;
  let id = editing ? editingItem.id : props.item.id;
  let kind = editing ? editingItem.kind : props.item.kind;
  let dir = editing ? getDirection(editingText) : getDirection(fixedText);

  // todo: this should move to calendar system!
  const objectivePeriodTagElement = function(item: Item) {
    const objectiveType = item.month ? ObjectiveType.monthly
      : item.season ? ObjectiveType.seasonal
        : item.year ? ObjectiveType.yearly : ObjectiveType.none;
    if (objectiveType == ObjectiveType.none) {
      return (<></>);
    }

    let year: string = item.year?.toString() ?? "";
    const seasons = ["", "بهار", "تابستان", "پاییز", "زمستان"];
    const months = ["", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    const seasonIndex = item.season ?? 0;
    const monthIndex = item.month ?? 0;
    let season: string = seasons[seasonIndex];
    let month: string = months[monthIndex];
    let text: string = "";
    let style: string = "";
    if (item.year && item.month) {
      text = `${month}\xa0${year}`;
      style = "objective-tag objective-month-tag"
    } else if (item.year && item.season) {
      text = `${season}\xa0${year}`;
      style = "objective-tag objective-season-tag"
    } else if (item.year) {
      text = `${year}`;
      style = "objective-tag objective-year-tag"
    } else {
      text = "error!"
    }
    text = toPersianDigits(text.toString());
    return (
      <div className={style}>{text}</div>
    );
  }


  useEffect(() => {
    if (selected) {
      // console.log(ref);
      scrollIntoViewIfNeeded(ref.current);
      // ref.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
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

  return (
    <Box
      ref={ref}
      dir="rtl"
      id={id}
      className="goal_note_item"
      onMouseEnter={() => { setHovered(true); }}
      onMouseLeave={() => { setHovered(false); }}
      sx={{
        borderRight: selected ? '4px solid darkorchid' : hovered ? '4px solid aliceblue' : '4px solid white',
        backgroundColor: selected ? 'lavender' : hovered ? 'aliceblue' : 'white',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
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
              inputProps={{
                style: {
                  fontSize: (kind == ItemKind.note) ? "0.85em" : "1em",
                  fontWeight: (kind == ItemKind.note) ? 300 : 400,
                }
              }}
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
            {objectivePeriodTagElement(editingItem)}
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
              inputProps={{
                style: {
                  fontSize: (kind == ItemKind.note) ? "0.85em" : "1em",
                  fontWeight: (kind == ItemKind.note) ? 300 : 400,
                  caretColor: 'transparent',
                }
              }}
              multiline={(kind == ItemKind.note)}
              maxRows={(kind == ItemKind.note) ? 40 : 1}
              fullWidth
              value={fixedText}
              onMouseDown={() => { onSelect(id); }}
            />
            {objectivePeriodTagElement(editingItem)}
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
});

export default GoalNoteItem;
