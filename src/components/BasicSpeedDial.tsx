import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddTaskIcon from '@mui/icons-material/AddTask';

const actions = [
  { icon: <AddTaskIcon />, name: 'Goal' },
  { icon: <NoteAddIcon />, name: 'Note' },
  // { icon: <PrintIcon />, name: 'Print' },
  // { icon: <ShareIcon />, name: 'Share' },
];

export default function BasicSpeedDial({onClick}) {
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
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
    </Box>
  );
}
