import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Action } from './../constants.ts';

export default function GoalNoteItemMenu(props: any) {
  const { anchorEl, handleClose } = props;
  const open = Boolean(anchorEl);

  return (
    <Menu
      id="item-context-menu"
      aria-hidden={false}
      anchorEl={anchorEl}
      open={open}
      onClose={() => handleClose(Action.none)}
      MenuListProps={{
        'aria-labelledby': 'item-context-menu-button',
      }}
    >
      <MenuItem onClick={() => handleClose(Action.editSelectedItem)}>Edit</MenuItem>
      <MenuItem onClick={() => handleClose(Action.copySelectedItemText)}>Copy Text</MenuItem>
      <MenuItem onClick={() => handleClose(Action.deleteSelectedItem)}>Delete</MenuItem>
    </Menu>
  );
}
