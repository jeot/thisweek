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

import { getDirection, getItemObjectiveType } from "../utilities.ts"
import { ItemKind, ItemStatus } from "../constants.ts";

import { forwardRef } from 'react';
import type { Item } from "../my_types.ts";
import ObjectivesPopover from "./ObjectivesPopover.tsx";

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
  const { editing, selected, onSubmit, onEdit, onSelect, onDelete, onCancel, onToggle, onCopyText, onFocusLeave, onObjectiveTypeChanged } = props;

  if (props.item === null || props.item === undefined) {
    console.log("item null");
    return;
  }

  const [editingItem, setEditingItem] = useState<Item>(props.item);

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
  let objectiveType = editing ? getItemObjectiveType(editingItem) : getItemObjectiveType(props.item);

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
      ref={ref}
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
              year={editingItem.year} season={editingItem.season} month={editingItem.month}
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
              year={props.item.year} season={props.item.season} month={props.item.month}
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
});

export default GoalNoteItem;
