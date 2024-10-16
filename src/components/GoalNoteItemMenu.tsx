import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Action } from './../constants.ts';
import { ListItemIcon, ListItemText, MenuList, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function GoalNoteItemMenu(props: any) {
  const { anchorEl, handleClose } = props;
  const open = Boolean(anchorEl);

  return (
    <Menu
      id="item-context-menu"
      sx={{ width: '320px', maxWidth: '100%' }}
      aria-hidden={false}
      anchorEl={anchorEl}
      open={open}
      onClose={() => handleClose(Action.none)}
      MenuListProps={{
        'aria-labelledby': 'item-context-menu-button',
      }}
    >
      <MenuList>
        <MenuItem onClick={() => handleClose(Action.editSelectedItem)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleClose(Action.copySelectedItemText)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Text</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleClose(Action.deleteSelectedItem)}>
          <ListItemIcon>
            <DeleteIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
