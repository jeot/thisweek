import { useState, useEffect } from "react";

import "./styles.css";

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
    if (editing && event.key === 'Enter' && event.shiftKey && type == 'Note') {
      if (editingText == "") onCancel(id);
      else {
        editingText = editingText + "\n";
      }
    } else if (editing && event.key === 'Enter') {
      if (editingText == "") onCancel(id);
      else onSubmit({ id:id, text: editingText });
      setEditingText("");
    } else if (editing && event.key === 'Escape') {
      onCancel(id);
      setEditingText("");
    } else {}
  };

  const onCheckBoxChanged = () => {
      onToggle(id);
  }

  return (
  <div dir="rtl" id={id} className="goal_note_item_class" >
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      {(type == 'Goal') &&
        <Checkbox
          checked={done}
          onChange={onCheckBoxChanged}
          size="small"
        />
      }
      {(type == 'Note') &&
        <IconButton aria-label="note" size="small" disabled color="secondary" >
          <TextSnippetIcon color="secondary" />
        </IconButton>
      }
      {editing &&
        <>
        <TextField
          dir={dir}
          variant="outlined"
          size="small"
          inputProps={{style: {fontSize: (type == 'Note')?"0.85em":"1em"}}}
          multiline={(type == 'Note')}
          maxRows={(type == 'Note')?40:1}
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
          inputProps={{style: {fontSize: (type == 'Note')?"0.85em":"1em"}}}
          multiline={(type == 'Note')}
          maxRows={(type == 'Note')?40:1}
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

