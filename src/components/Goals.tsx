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

function NewGoal({modifiable, onSubmit, onEditing}) {

  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    onEditing(editing);
  }, [editing]);

  const submit = () => {
      if (text.length == 0)
        cancel();
      else {
        console.log("calling Submit");
        onSubmit({ id: 0, text: text });
        setText("");
        setEditing(true);
        // by not resetting editing, we can input new goals immediately
        // setEditing(false);
      }
  }

  const cancel = () => {
    // note: comment this line if you want to preserve the text on Esc.
    setText("");
    setEditing(false);
  }

  const onFocus = () => {
    // setEditing(true);
    // console.log('in focused');
  }
  const onBlur = () => {
    console.log('onBlur: calling cancel()');
    cancel();
  }

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      submit();
    }
    if (editing && event.key === 'Escape') {
      cancel();
    }
  };

  const handleNewGoalClick = (event) => {
    setEditing(true);
  };

  return (
    <div dir="rtl">
      { editing ?
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          autoFocus
          onFocus={onFocus}
          onBlur={onBlur}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="هدف جدید..."
        />
        : modifiable?
          <Button
            type="Button"
            variant="contained"
            className="btn-primary"
            onClick={handleNewGoalClick}
          >هدف جدید</Button>
          : <></>
      }
    </div>
  );

}

function Goal({goal, modifiable, onSubmit, onEditing, onGoalDelete}) {

  const [text, setText] = useState(goal.text);
  const [done, setDone] = useState(goal.done);
  const [editing, setEditing] = useState(false);

  // useEffect(() => {
  //   onEditing(editing);
  // }, [editing]);

  const onFocus = () => {
    // console.log('in focused');
  }

  const onBlur = () => {
    // setEditing(false);
    // getGoal();
    // console.log('out of focused');
  }

  const getGoal = () => {
    invoke("get_goal", { id: goal.id }).then((goal_response) => {
      console.log("get_goal...");
      console.log(goal_response);
      // todo: update the goal
      if (goal_response?.Goal) {
        let g = goal_response.Goal;
        console.log(g);
        setText(g.text);
        setDone(g.done);
      }
    });
  }

  const handleKeyDown = (event) => {
    if (editing && event.key === 'Enter') {
      setEditing(false);
      onEditing(false);
      onSubmit({ id: goal.id, text: text });
      // getGoal();
    }
    if (editing && event.key === 'Escape') {
      setEditing(false);
      onEditing(false);
      getGoal();
    }
  };

  const onCheckBoxChanged = () => {
    invoke("goal_checkbox_changed", { id: goal.id }).then((done_result) => {
      console.log(done_result);
      setDone(done_result);
    });
  }

  const onGoalEdit = () => {
    setEditing(true);
    onEditing(true);
  }

  return (
    <div dir="rtl" id={goal.id}>
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <Checkbox
        checked={done}
        onChange={onCheckBoxChanged}
        size="small"
      />
      {editing &&
        <>
        <TextField
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
            onSubmit({ id: goal.id, text: text });
            setEditing(false);
            onEditing(false);
            // getGoal();
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
            onEditing(false);
            getGoal();
          }}
        >
          <CancelIcon fontSize="small"/>
        </IconButton>
        </>
      }
      {!editing && modifiable &&
        <>
        <InputBase
          size="small"
          fullWidth
          value={text}
        />
        <IconButton
          aria-label="edit"
          size="small"
          color="primary"
          onClick={() => {onGoalEdit()}}
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
        </>
      }
      {!editing && !modifiable &&
        <>
        <InputBase
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

export default function GoalList({goals, onSubmit, onEditing, onGoalDelete}) {

  const [modifiable, setModifiable] = useState(true);

  const onLocalEditing = (e) => {
    console.log("onLocalEditing");
    if (e) {
      setModifiable(false);
    } else {
      setModifiable(true);
    }
    onEditing(e);
  }

  return (
    <>
      {goals.map(goal =>
        <Goal
          key={goal.id}
          goal={goal}
          modifiable={modifiable}
          onSubmit={onSubmit}
          onEditing={onLocalEditing}
          onGoalDelete={onGoalDelete}
        />
      )}
      <NewGoal
        modifiable={modifiable}
        onSubmit={onSubmit}
        onEditing={onLocalEditing}
      />
    </>
    );
}
