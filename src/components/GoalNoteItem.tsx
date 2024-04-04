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

import { invoke } from "@tauri-apps/api/tauri";
import { getDirection } from "./../utilities.tsx"

import TextSnippetIcon from '@mui/icons-material/TextSnippet';

export default function GoalNoteItem({type, item, modifiable, onSubmit, onEdit, onDelete}) {

  const [text, setText] = useState(item.text);
  const [done, setDone] = useState((type == "Goal") ? item.done : false);
  const [editing, setEditing] = useState((type == "NewGoal") ? true : false);
  const [dir, setDir] = useState('rtl');

  useEffect(() => {
      setDir(getDirection(text));
    }, [text]);

  const onFocus = () => { }

  const onBlur = () => { }

  const getItem = () => {
    invoke("get_item", { id: item.id }).then((response) => {
      console.log("get_item...");
      console.log(response);
      if (response?.Goal) {
        let g = response.Goal;
        console.log(g);
        setText(g.text);
        setDone(g.done);
      } else if (response?.Note) {
        let n = response.Note;
        console.log(n);
        setText(n.text);
      }
      else { }
    });
  }

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      setEditing(false);
      onEdit(false);
      onSubmit({ id: item.id, text: text });
    }
    if (editing && event.key === 'Escape') {
      setEditing(false);
      onEdit(false);
      getItem();
    }
  };

  const onCheckBoxChanged = () => {
    invoke("goal_checkbox_changed", { id: item.id }).then((done_result) => {
      console.log(done_result);
      // setDone(done_result);
      getItem();
    });
  }

  return (
    <div dir="rtl" id={item.id}>
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      {(type == "Goal" || type == "NewGoal") &&
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
          value={text}
          onKeyDown={handleKeyDown}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <IconButton
          aria-label="ok"
          size="small"
          color="success"
          onClick={() => {
            onSubmit({ id: item.id, text: text });
            setEditing(false);
            onEdit(false);
          }}
        >
          <CheckCircleIcon fontSize="small"/>
        </IconButton>
        <IconButton
          aria-label="cancel"
          size="small"
          color="default"
          onClick={() => {
            setEditing(false);
            onEdit(false);
            getItem();
          }}
        >
          <CancelIcon fontSize="small"/>
        </IconButton>
        </>
      }
      {!editing && modifiable &&
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
            setEditing(true);
            onEdit(true);
            }}
        >
          <EditIcon fontSize="small"/>
        </IconButton>
        <IconButton
          aria-label="delete"
          size="small"
          color="error"
          onClick={() => {onDelete(item.id)}}
        >
          <DeleteIcon fontSize="small"/>
        </IconButton>
        </>
      }
      {!editing && !modifiable &&
        <>
        <InputBase
          dir={dir}
          size="small"
          fullWidth
          value={text}
        />
        </>
      }
      </Stack>
    </div>
  );
}

