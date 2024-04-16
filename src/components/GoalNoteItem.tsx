import { useState, useEffect } from "react";

// import "./styles.css";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatIcon from '@mui/icons-material/Chat';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { getDirection } from "./../utilities.tsx"


export default function GoalNoteItem({type, id, text, done, modifiable, editing, selected, onSubmit, onEdit, onSelect, onDelete, onCancel, onToggle}) {

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

  const onBlur = () => { }

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter' && event.shiftKey && type == 'Note') {
      if (editingText == "") onCancel(id);
      else {
        setEditingText(editingText + "\n");
      }
    } else if (editing && event.key === 'Enter') {
      if (editingText == "") onCancel(id);
      else onSubmit({ id:id, text: editingText, keyboard_submit: true});
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
  <Box
    dir="rtl"
    id={id}
    className="goal_note_item"
    onMouseEnter={() => {setHovered(true);}}
    onMouseLeave={() => {setHovered(false);}}
    sx={{
      borderRight: selected ? '4px solid darkorchid' : hovered ? '4px solid aliceblue' : '4px solid white',
      backgroundColor: selected ? 'lavender': hovered ? 'aliceblue' : 'white',
    }}
  >
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
          <ChatIcon color="text.default" />
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
            setEditingText("");
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
            setEditingText("");
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
          inputProps={{style: {
            fontSize: (type == 'Note')?"0.9em":"1em",
            fontWeight:  (type == 'Note')?300:400,
          }}}
          multiline={(type == 'Note')}
          maxRows={(type == 'Note')?40:1}
          fullWidth
          value={text}
          onMouseDown={() => {onSelect(id);}}
        />
        <IconButton
          aria-label="copy"
          size="small"
          color="secondary"
          onClick={() => {navigator.clipboard.writeText(text)}}
        >
          <ContentCopyIcon fontSize="small"/>
        </IconButton>
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
  </Box>
  );
}

