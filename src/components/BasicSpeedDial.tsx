import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddTaskIcon from '@mui/icons-material/AddTask';

const actions = [
  { icon: <AddTaskIcon />, name: 'Goal' },
  { icon: <NoteAddIcon />, name: 'Note' },
  // { icon: <PrintIcon />, name: 'Print' },
  // { icon: <ShareIcon />, name: 'Share' },
];

type CallbackFunction = (action_name: string) => void;

export default function BasicSpeedDial({ onClick }: { onClick: CallbackFunction }) {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => { onClick(action.name); }}
        />
      ))}
    </SpeedDial>
  );
}
