import { useState, useEffect } from "react";
import GoalNoteItem from "./GoalNoteItem.tsx";
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

function WeekHeader(props) {
  return (
    <Stack
      className="week-title" dir="auto"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1,
        fontSize: "1em",
        fontWeight: 700,
        backgroundColor: '#EBEDEF',
      }}
    >
      <Tooltip title="Next Week">
        <IconButton aria-label="next" size="small" color="text.default"
          onClick={() => { props.onNextWeek(); }}
        >
          <NavigateNextIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {props.weekState.week_title.toPersianDigits()}
      <Tooltip title="Previous Week">
        <IconButton aria-label="previous" size="small" color="text.default"
          onClick={() => { props.onPreviousWeek(); }}
        >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function WeekItemsList(props) {

  let item;
  let type;
  const item_elements = props.weekState.items.map((item) => {
    if ('Goal' in item) {
      item = item.Goal;
      type = 'Goal';
    } else if ('Note' in item) {
      item = item.Note;
      type = 'Note';
    } else
      return (<></>);

    let editing = (item.id == 'new_goal_id' || item.id == 'new_note_id' || item.id == props.editingId);
    let selected = (item.id == props.selectedId);

    return (
      <GoalNoteItem
        key={item.id}
        type={type}
        id={item.id}
        text={item.text}
        done={item.done}
        editing={editing}
        selected={selected}
        {...props} // it's passed by refference, so no big deal!
      />);
  });

  // console.log(item_elements);

  const new_goal_item = { id: 0, text: "", done: false };

  return (
    <>
      {item_elements}
      {(props.editingId == 'new_goal_id') &&
        <GoalNoteItem
          key={'new_goal_id'}
          type={'Goal'}
          id={'new_goal_id'}
          text={""}
          done={false}
          editing={true}
          selected={false}
          {...props}
        />
      }
      {(props.editingId == 'new_note_id') &&
        <GoalNoteItem
          key={'new_note_id'}
          type={'Note'}
          id={'new_note_id'}
          text={""}
          done={false}
          editing={true}
          selected={false}
          {...props}
        />
      }
    </>
  );

}

export default function Week(props) {

  return (
    <Box sx={{ p: 0, pb: 10 }}>
      <WeekHeader {...props} />

      <WeekItemsList
        {...props}
      />

    </Box>
  );

}
