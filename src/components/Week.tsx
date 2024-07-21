import GoalNoteItem from "./GoalNoteItem.tsx";
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { ids, itemKind, itemStatus } from "../constants.ts";

function WeekHeader(props) {

  const style = {
    p: 1,
    fontSize: "1em",
    fontWeight: 700,
    backgroundColor: '#EBEDEF',
  };

  return (
    <Stack
      className="week-title" dir="auto"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={style}
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
  const item_elements = props.weekState.items.map((item, i) => {
    let editing = (item.id == props.editingId);
    let selected = (item.id == props.selectedId);

    return (
      <GoalNoteItem
        ref={props.itemsRefs.current[i]}
        key={item.id}
        item={item}
        editing={editing}
        selected={selected}
        {...props} // it's passed by refference, so no big deal!
      />);
  });
  // console.log(item_elements);

  return (
    <div dir="rtl" >
      {item_elements}
      {
        (props.editingId == ids.new_goal) &&
        <GoalNoteItem
          key={'new_goal_key'}
          item={{ id: ids.new_goal, kind: itemKind.goal, title: "", note: "", status: itemStatus.undone }}
          editing={true}
          selected={false}
          {...props}
        />
      }
      {
        (props.editingId == ids.new_note) &&
        <GoalNoteItem
          key={'new_note_key'}
          item={{ id: ids.new_note, kind: itemKind.note, title: "", note: "", status: itemStatus.undone }}
          editing={true}
          selected={false}
          {...props}
        />
      }
    </div>
  );

}

export default function Week(props) {
  const style = {
    p: 0,
    pb: 10,
  };
  return (
    <Box sx={style} >
      <WeekHeader
        {...props}
      />

      <WeekItemsList
        {...props}
      />

    </Box >
  );

}
