import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TextField from '@mui/material/TextField';

import './styles.css'
import { getDirection } from "../utilities";
import { ItemKind } from "../constants";

export default function NewItem(props: any) {

  const { initKind, onSubmit, onCancel } = props;
  const [editingText, setEditingText] = useState<string>("");
  const [kind, setKind] = useState<number>(initKind);

  let dir = getDirection(editingText);

  const style_input = `item-input ${kind == ItemKind.goal ? "item-input-goal" : "item-input-note"}`;
  const inputPropsStyle = function(itemkind: number) {
    return {
      fontSize: (itemkind == ItemKind.note) ? "0.85em" : "1em",
      fontWeight: (itemkind == ItemKind.note) ? 300 : 400,
      caret: "visible",
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event: any) => {
    if (event.key === 'Enter' && event.shiftKey && kind == ItemKind.note) {
      if (editingText == "") onCancel();
      else {
        /* here input field will automatically insert a new line! */
      }
    } else if (event.key === 'Enter') {
      if (editingText == "") onCancel();
      else {
        console.log("text", editingText);
        onSubmit(kind, editingText, true);
        setEditingText("");
        event.preventDefault();
      }
    } else if (event.key === 'Escape') {
      onCancel();
      setEditingText("");
    } else { }
  };

  return (
    <div className="new-item" dir="rtl">
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
        // onFocus={onFocus}
        // onBlur={onBlur}
        value={editingText}
        onKeyDown={handleKeyDown}
        onChange={(e) => setEditingText(e.currentTarget.value)}
      />
      <IconButton
        aria-label="ok"
        size="small"
        color="success"
        onClick={() => {
          onSubmit(kind, editingText, false);
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
          onCancel();
          setEditingText("");
        }}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
