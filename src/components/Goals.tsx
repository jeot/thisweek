import { useState, useEffect } from "react";

import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';

import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


import { invoke } from "@tauri-apps/api/tauri";

function NewGoal({onSubmit, onEditing}) {

  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    onEditing(editing);
  }, [editing]);

  const onFocus = () => {
    // console.log('in focused');
  }
  const onBlur = () => {
    setEditing(false);
    // console.log('out of focused');
  }

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      if (text.length != 0) {
        onSubmit({ id: 0, text: text });
        setText("");
        // onEditing(false);
      } else {
        setEditing(false);
      }
    }
    if (editing && event.key === 'Escape') {
      // note: uncomment if you want to remove the text on Esc.
      // setText("");
      setEditing(false);
      // onEditing(false);
    }
  };

  const handleNewGoalClick = (event) => {
    setEditing(true);
    // console.log("button clicked:");
  };

  return (
    <div>
      {editing &&
        <input
          dir="auto"
          type="text"
          id="new-goal-input"
          autoFocus
          onFocus={onFocus}
          onBlur={onBlur}
          className="goal-text"
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          value={text}
          placeholder="Enter your new week goal..."
        />
      }
      {!editing &&
        <Button
          type="Button"
          variant="contained"
          className="btn-primary"
          onClick={handleNewGoalClick}
        >New Goal</Button>
      }
    </div>
  );

}

function Goal({goal, onSubmit, onEditing, onGoalDelete}) {

  const [text, setText] = useState(goal.text);
  const [done, setDone] = useState(goal.done);

  const onCheckBoxChanged = () => {
    invoke("goal_checkbox_changed", { id: goal.id }).then((done_result) => {
      console.log(done_result);
      setDone(done_result);
    });
  }

  const handleGoalEdit = () => {
    console.log("handleGoalEdit");
  }

  return (
    <div dir="rtl" id={goal.id}>
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Checkbox
        checked={done}
        onChange={onCheckBoxChanged}
      />
      <TextField
        variant="outlined"
        size="small"
        margin="dense"
        fullWidth
        value={text}
        sx={{ ml: 1, flex: 1 }}
        // onChange={(e) => { setText(e.currentTarget.value) } }
      />
      <IconButton
        aria-label="edit"
        size="small"
        color="primary"
        onClick={() => {handleGoalEdit}}
      >
        <EditIcon fontSize="small"/>
      </IconButton>
      <IconButton
        aria-label="delete"
        size="small"
        color="error"
        onClick={() => {onGoalDelete(goal.id)}}
      >
        <DeleteIcon fontSize="small"/>
      </IconButton>
      </Stack>
    </div>
  );
}

export default function GoalList({goals, onSubmit, onEditing, onGoalDelete}) {
  return (
    <div>
      {goals.map(goal =>
        <Goal
          key={goal.id}
          goal={goal}
          onSubmit={onSubmit}
          onEditing={onEditing}
          onGoalDelete={onGoalDelete}
        />
      )}
      <NewGoal onSubmit={onSubmit} onEditing={onEditing} />
    </div>
    );
}
