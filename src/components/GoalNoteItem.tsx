import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import InputBase from '@mui/material/InputBase';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

// import { invoke } from "@tauri-apps/api/tauri";
import { getDirection } from "./../utilities.tsx"

import TextSnippetIcon from '@mui/icons-material/TextSnippet';

export default function GoalNoteItem({type, id, text, done, modifiable, editing, onSubmit, onEdit, onDelete, onCancel, onToggle}) {

  const [editingText, setEditingText] = useState(text);
  const [dir, setDir] = useState('rtl');

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

  const onBlur = () => { }

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      onSubmit({ id:id, text: editingText });
    }
    if (editing && event.key === 'Escape') {
      onCancel(id);
    }
  };

  const onCheckBoxChanged = () => {
      onToggle(id);
  }

  return (
    <div dir="rtl" id={id}>
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      {(type == 'Goal') &&
        <Checkbox
          checked={done}
          onChange={onCheckBoxChanged}
          size="small"
        />
      }
      {editing &&
        <>
        <TextField
          dir={dir}
          variant="outlined"
          size="small"
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
          }}
        >
          <CheckCircleIcon fontSize="small"/>
        </IconButton>
        <IconButton
          aria-label="cancel"
          size="small"
          color="default"
          onClick={() => {
            onCancel(id);
          }}
        >
          <CancelIcon fontSize="small"/>
        </IconButton>
        </>
      }
      {!editing &&
        <>
        <InputBase
          dir={dir}
          size="small"
          fullWidth
          value={text}
        />
        <IconButton
          aria-label="edit"
          size="small"
          color="primary"
          onClick={() => {
            onEdit(id);
            }}
        >
          <EditIcon fontSize="small"/>
        </IconButton>
        <IconButton
          aria-label="delete"
          size="small"
          color="error"
          onClick={() => {onDelete(id)}}
        >
          <DeleteIcon fontSize="small"/>
        </IconButton>
        </>
      }
      </Stack>
    </div>
  );
}

