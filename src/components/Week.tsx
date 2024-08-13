import GoalNoteItem from "./GoalNoteItem.tsx";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { ids, itemKind, itemStatus } from "../constants.ts";

import './styles.css'

function WeekHeader(props: any) {

  return (
    <div className="week-header">
      <Tooltip title="Next Week">
        <IconButton aria-label="next" size="small" color="info"
          onClick={() => { props.onNextWeek(); }}
        >
          <NavigateNextIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {props.weekState.week_title.toPersianDigits()}
      <Tooltip title="Previous Week">
        <IconButton aria-label="previous" size="small" color="info"
          onClick={() => { props.onPreviousWeek(); }}
        >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

function WeekItemsList(props: any) {
  const item_elements = props.weekState.items.map((item: any, i: any) => {
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
    <div className="week-main">
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

export default function Week(props: any) {
  return (
    <div className="week-section">
      <WeekHeader
        {...props}
      />

      <WeekItemsList
        {...props}
      />

    </div>
  );

}
