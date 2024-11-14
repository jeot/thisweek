import { useRef, useState } from "react";
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TextField from '@mui/material/TextField';

import './styles.css'
import { getDirection } from "../utilities";
import { ItemKind } from "../constants";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

export default function NewItem(props: any) {

  const { initKind, onSubmit, onCancel } = props;
  const [editingText, setEditingText] = useState<string>("");
  const [kind, setKind] = useState<number>(initKind);

  const textFieldRef = useRef<any>(null);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newKind: number,
  ) => {
    if (newKind != null)
      setKind(newKind);
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };

  let direction_setting = props.config.items_display_direction;
  let dir_auto = getDirection(editingText);
  let dir = "ltr";
  if (direction_setting === "rtl") dir = "rtl";
  if (direction_setting === "ltr") dir = "ltr";
  if (direction_setting === "auto") dir = dir_auto;

  const style_input = `item-input ${kind == ItemKind.goal ? "item-input-goal" : "item-input-note"}`;
  const inputPropsStyle = function(itemkind: number) {
    return {
      fontSize: (itemkind == ItemKind.note) ? "0.85em" : "1em",
      fontWeight: (itemkind == ItemKind.note) ? 300 : 400,
      caret: "visible",
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event: React.KeyboardEvent) => {
    // ignore Enter with other mod-keys
    if (event.key === 'Enter' && (event.ctrlKey || event.altKey || event.metaKey)) {
      event.preventDefault();
      return;
    }
    let escape = false;
    let enter = false;
    let shift = false;
    if (event.key === 'Escape') escape = true;
    if (event.key === 'Enter') enter = true;
    if (event.shiftKey) shift = true;

    if ((enter) && editingText == "") {
      event.preventDefault();
      onCancel();
      return;
    }
    if (enter && !shift) {
      // console.log("submitting text: ", editingText);
      onSubmit(kind, editingText, true);
      setEditingText("");
      event.preventDefault();
    } else if (escape) {
      event.preventDefault();
      onCancel();
    } else { }
  }

  const onFocus = () => { }

  const onBlur = () => {
    // if (editingText == "") onCancel();
  }

  return (
    <div className="new-item" dir={dir}>
      <ToggleButtonGroup
        className="new-item-kind-button-group"
        dir="ltr"
        color="info"
        value={kind}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        size="small"
      >
        <ToggleButton value={ItemKind.goal}>Goal</ToggleButton>
        <ToggleButton value={ItemKind.note}>Note</ToggleButton>
      </ToggleButtonGroup>

      <TextField
        dir={dir}
        variant="outlined"
        inputRef={textFieldRef}
        size="small"
        className={style_input}
        inputProps={{ style: inputPropsStyle(kind) }}
        multiline={true}
        maxRows={(kind == ItemKind.note) ? 15 : 5}
        fullWidth
        autoFocus
        onFocus={onFocus}
        onBlur={onBlur}
        value={editingText}
        onKeyDown={handleKeyDown}
        onChange={(e) => setEditingText(e.currentTarget.value)}
      />
      <IconButton
        aria-label="ok"
        size="small"
        color="success"
        onClick={() => {
          onSubmit(kind, editingText, false);
          setEditingText("");
        }}
      >
        <CheckCircleIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="cancel"
        size="small"
        color="default"
        onClick={() => {
          onCancel();
          setEditingText("");
        }}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
