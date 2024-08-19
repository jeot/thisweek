import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { ObjectiveType, Page, ItemKind } from '../constants';

const actions = [
  { icon: <AddTaskIcon />, name: 'Weekly\xa0Goal', itemKind: ItemKind.goal, objectiveType: ObjectiveType.none, },
  { icon: <AddTaskIcon />, name: 'Monthly\xa0Goal', itemKind: ItemKind.goal, objectiveType: ObjectiveType.monthly, },
  { icon: <AddTaskIcon />, name: 'Seasonal\xa0Goal', itemKind: ItemKind.goal, objectiveType: ObjectiveType.seasonal, },
  { icon: <AddTaskIcon />, name: 'Yearly\xa0Goal', itemKind: ItemKind.goal, objectiveType: ObjectiveType.yearly, },
  { icon: <NoteAddIcon />, name: 'Weekly\xa0Note', itemKind: ItemKind.note, objectiveType: ObjectiveType.none, },
  { icon: <NoteAddIcon />, name: 'Monthly\xa0Note', itemKind: ItemKind.note, objectiveType: ObjectiveType.monthly, },
  { icon: <NoteAddIcon />, name: 'Seasonal\xa0Note', itemKind: ItemKind.note, objectiveType: ObjectiveType.seasonal, },
  { icon: <NoteAddIcon />, name: 'Yearly\xa0Note', itemKind: ItemKind.note, objectiveType: ObjectiveType.yearly, },
];

type CallbackFunction = (itemKind: number, objectiveType: number) => void;

export default function BasicSpeedDial({ page, onNewAction }: { page: number, onNewAction: CallbackFunction }) {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => {
        if (page == Page.weeks && action.objectiveType != ObjectiveType.none) return;
        if (page == Page.objectives && action.objectiveType == ObjectiveType.none) return;
        else
          return (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipOpen
              tooltipTitle={action.name}
              onClick={() => { onNewAction(action.itemKind, action.objectiveType); }}
            />
          );
      }
      )}
    </SpeedDial>
  );
}
