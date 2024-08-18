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
import { ObjectiveType, itemKind, itemStatus } from "../constants.ts";

import { forwardRef } from 'react';

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
  const { item, editing, selected, onSubmit, onEdit, onSelect, onDelete, onCancel, onToggle, onCopyText, onFocusLeave } = props;

  let text = (item.kind === itemKind.goal) ? item.title
    : (item.kind === itemKind.note) ? item.note : null;
  text ??= "ERROR! INVALID TEXT";
  let status = item.status === itemStatus.undone ? false :
    item.status === itemStatus.done ? true : false;
  let id = item.id;
  let kind = item.kind;

  // todo: this should move to calendar system!
  const objectivePeriodTagElement = function(item: any) {
    const objectiveType = item.month ? ObjectiveType.monthly
      : item.season ? ObjectiveType.seasonal
        : item.year ? ObjectiveType.yearly : ObjectiveType.none;
    if (objectiveType == ObjectiveType.none) {
      return (<></>);
    }

    let year: string = item.year ?? "";
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
      text = "error! invalid itme property!"
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

  const [editingText, setEditingText] = useState(text);
  const [dir, setDir] = useState('rtl');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (editing) {
      setEditingText(text);
    }
  }, [editing]);

  useEffect(() => {
    if (editing) {
      setDir(getDirection(editingText));
    } else {
      setDir(getDirection(text));
    }
  }, [text, editingText, editing]);

  const onFocus = () => { }

  const onBlur = () => {
    onFocusLeave({ id: id, text: editingText });
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event: any) => {
    if (editing && event.key === 'Enter' && event.shiftKey && kind == itemKind.note) {
      if (editingText == "") onCancel(id);
      else {
        /* here input field will automatically insert a new line! */
      }
    } else if (editing && event.key === 'Enter') {
      if (editingText == "") onCancel(id);
      else onSubmit({ id: id, text: editingText, keyboard_submit: true });
      setEditingText("");
    } else if (editing && event.key === 'Escape') {
      onCancel(id);
      setEditingText("");
    } else { }
  };

  const onCheckBoxChanged = () => {
    onToggle(id);
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
        {(kind == itemKind.goal) &&
          <Checkbox
            checked={status}
            onChange={onCheckBoxChanged}
            size="small"
          />
        }
        {(kind == itemKind.note) &&
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
                  fontSize: (kind == itemKind.note) ? "0.85em" : "1em",
                  fontWeight: (kind == itemKind.note) ? 300 : 400,
                }
              }}
              multiline={(kind == itemKind.note)}
              maxRows={(kind == itemKind.note) ? 40 : 1}
              fullWidth
              autoFocus
              onFocus={onFocus}
              onBlur={onBlur}
              value={editingText}
              onKeyDown={handleKeyDown}
              onChange={(e) => setEditingText(e.currentTarget.value)}
            />
            <IconButton
              aria-label="ok"
              size="small"
              color="success"
              onClick={() => {
                onSubmit({ id: id, text: editingText });
                setEditingText("");
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
                setEditingText("");
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
                  fontSize: (kind == itemKind.note) ? "0.85em" : "1em",
                  fontWeight: (kind == itemKind.note) ? 300 : 400,
                  caretColor: 'transparent',
                }
              }}
              multiline={(kind == itemKind.note)}
              maxRows={(kind == itemKind.note) ? 40 : 1}
              fullWidth
              value={text}
              onMouseDown={() => { onSelect(id); }}
            />
            {objectivePeriodTagElement(item)}
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
