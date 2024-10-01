import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { ItemKind } from '../constants';

const actions = [
  { icon: <AddTaskIcon />, name: 'New\xa0Goal', itemKind: ItemKind.goal },
  { icon: <NoteAddIcon />, name: 'New\xa0Note', itemKind: ItemKind.note },
];

type CallbackFunction = (itemKind: number) => void;

export default function BasicSpeedDial({ page, onNewAction }: { page: number, onNewAction: CallbackFunction }) {
  page;
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => {
        return (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipOpen
            tooltipTitle={action.name}
            onClick={() => { onNewAction(action.itemKind); }}
          />
        );
      }
      )}
    </SpeedDial>
  );
}
