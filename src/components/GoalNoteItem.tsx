import { useState, useEffect, useRef, KeyboardEventHandler } from "react";

import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { getDirection } from "../utilities.ts"
import { Action, ItemKind } from "../constants.ts";

import ObjectivesPopover from "./ObjectivesPopover.tsx";
import GoalNoteItemMenu from "./GoalNoteItemMenu.tsx";

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
  const itemsBoxTop = document.getElementById("items-list-id")?.getBoundingClientRect().top ?? 0;
  const itemsBoxBot = document.getElementById("items-list-id")?.getBoundingClientRect().bottom ?? 0;
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
  const { editing, selected, index, onEditSubmit, onEdit, onSelect, onToggleSelect, onDelete, onCancel, onToggle, onCopyText, onFocusLeave, onObjectiveTypeChanged } = props;

  if (props.item === null || props.item === undefined) {
    console.log("item null");
    return;
  }

  const [editingText, setEditingText] = useState<string>(props.item.text);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchorPosition, setMenuAnchorPosition] = useState<{ top: number; left: number; } | null>(null);
  const itemRef = useRef<null | React.RefObject<HTMLElement>>(null);
  const inputRef = useRef<null | React.RefObject<HTMLElement>>(null);

  const fixedText = props.item.text ?? "ERROR! INVALID TEXT";
  const status = props.item.status ?? false;
  let id = props.item.id;
  let kind = props.item.kind;
  let dir = editing ? getDirection(editingText) : getDirection(fixedText);
  const objective_tag = props.item.objective_tag;

  useEffect(() => {
    // console.log("item did mount");
    return () => { /* console.log("item unmounted"); */ };
  }, []);

  const handleOpenItemMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSelect(id);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleOpenItemContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onSelect(id);
    setMenuAnchorPosition(
      menuAnchorPosition === null
        ? {
          top: event.clientY - 6,
          left: event.clientX + 2,
        }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        // Other native context menus might behave different.
        // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        null,
    );
  };

  const handleCloseItemMenu = (select: number) => {
    setMenuAnchorEl(null);
    setMenuAnchorPosition(null);
    // console.log("closing menu, select: ", select);
    switch (select) {
      case Action.none: break; // menu closed by clicking outside
      case Action.editSelectedItem: onEdit(id); break;
      case Action.deleteSelectedItem: onDelete(id); break;
      case Action.copySelectedItemText: onCopyText(id); break;
      default:
        console.log("Warning! invalid context menu item select callback: ", select);
    }
  };

  useEffect(() => {
    if (selected) {
      itemRef.current && scrollIntoViewIfNeeded(itemRef.current as unknown as HTMLElement);
    }
  }, [selected, index]);

  useEffect(() => {
    if (editing) {
      setEditingText(props.item.text);
      inputRef.current && (inputRef.current as unknown as HTMLElement).focus();
    }
  }, [editing]);

  const onFocus = () => { }

  const onBlur = () => {
    onFocusLeave({ id: id, text: editingText });
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event: any) => {
    if (editing && event.key === 'Enter' && event.shiftKey && kind == ItemKind.note) {
      if (editingText == "") onCancel();
      else {
        /* here input field will automatically insert a new line! */
      }
    } else if (editing && event.key === 'Enter') {
      if (editingText == "") onCancel();
      else {
        onEditSubmit(id, editingText);
        setEditingText("");
      }
    } else if (editing && event.key === 'Escape') {
      onCancel();
      setEditingText("");
    } else { }
  };

  const style_item = `item ${selected ? "item-selected" : ""} ${kind == ItemKind.goal ? "item-goal" : "item-note"}`;
  const style_input = `item-input ${kind == ItemKind.goal ? "item-input-goal" : "item-input-note"}`;
  const inputPropsStyle = function(itemkind: number) {
    return {
      fontSize: (itemkind == ItemKind.note) ? "0.85em" : "1em",
      fontWeight: (itemkind == ItemKind.note) ? 300 : 400,
      caretColor: editing ? "visible" : "transparent",
      padding: "4px 0px 4px 0px",
    }
  }

  return (
    <Box
      ref={itemRef}
      dir={dir}
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
            onChange={() => onToggle(id)}
            size="small"
          />
        }
        {(kind == ItemKind.note) &&
          <IconButton aria-label="note" size="small" disabled color="secondary" >
            <ChatIcon color="warning" />
          </IconButton>
        }

        {editing &&
          <TextField
            dir={dir}
            variant="outlined"
            size="small"
            className={style_input}
            inputProps={{ style: inputPropsStyle(kind), ref: inputRef }}
            multiline={true}
            maxRows={(kind == ItemKind.note) ? 15 : 5}
            fullWidth
            autoFocus
            onFocus={onFocus}
            onBlur={onBlur}
            value={editingText}
            onKeyDown={handleKeyDown}
            onChange={(e) => setEditingText(e.currentTarget.value)}
          />
        }

        {!editing && <>
          <InputBase
            dir={dir}
            size="small"
            className={style_input}
            inputProps={{ style: inputPropsStyle(kind) }}
            multiline={true}
            maxRows={(kind == ItemKind.note) ? 15 : 5}
            fullWidth
            value={fixedText}
            onMouseDown={() => { onToggleSelect(id); }}
            onContextMenu={handleOpenItemContextMenu}
          />
          <IconButton
            id="item-context-menu-button"
            className="item-menu-btn"
            aria-label="menu"
            aria-controls={Boolean(menuAnchorEl) ? 'item-context-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(menuAnchorEl) ? 'true' : undefined}
            size="small"
            color="info"
            sx={{ backgroundColor: 'rgba(0, 0, 255, 0.03)', margin: '0px 2px' }}
            onClick={handleOpenItemMenu}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <ObjectivesPopover
            objective_tag={objective_tag}
            onChange={(y: number, s: number, m: number) => onObjectiveTypeChanged(id, y, s, m)}
            onPopoverOpened={() => onSelect(id)}
          />
        </>}

        {editing && <>
          <IconButton
            aria-label="ok"
            size="small"
            color="success"
            onClick={() => {
              onEditSubmit(id, editingText);
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
        </>}
      </Stack>
      {/* Menu */}
      <GoalNoteItemMenu
        anchorEl={menuAnchorEl}
        anchorPosition={menuAnchorPosition}
        handleClose={handleCloseItemMenu}
      />
    </Box >
  );
}

export default GoalNoteItem;
