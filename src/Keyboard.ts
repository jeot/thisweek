// import { useState, useEffect } from "react";
// import React from "react";
// import ReactDOM from "react-dom/client";
import { KEYMAPS } from "./Keymaps";
import { Action } from "./constants";

let listeners: Array<(action: Action) => void> = [];
let insert_mode: boolean = false;
let newKeyFlag: boolean = false;
let copyKeyFlag: boolean = false;

export function listen(cb: (action: number) => void) {
  // console.log("registering new callback for keyboard actions");
  if (!listeners.includes(cb)) { // avoid multiple same callback register
    listeners.push(cb);
  }
  return () => {
    listeners = listeners.filter((c) => c !== cb);
  };
}

function broadcastAction(action: Action) {
  listeners.forEach((c) => c(action));
}

function init() {
  // console.log(KEYMAPS);
  // console.log("adding new keydown event listener");
  window.addEventListener("keydown", handleUserKeyPress);
  listeners = [];
  insert_mode = false;
  newKeyFlag = false;
  copyKeyFlag = false;
}

let sequence_number: number = 0;
let current_sequence_keymap_array_index: number = 0;

const isModeMatch = (mode: string) => {
  if (mode.includes("I") && insert_mode) return true;
  if (mode.includes("N") && !insert_mode) return true;
  return false;
}

const checkKeyWithKeymapIndex = (i: number, event: KeyboardEvent) => {
  if (!isModeMatch(KEYMAPS[i].mode)) {
    return false;
  }
  const modmach = eventKeyModifierMatch(KEYMAPS[i].mod, event);
  const { codematch, newseqnum } = eventKeyCodeMatch(KEYMAPS[i].keys, sequence_number, event)
  if (!modmach || !codematch) { // not matched or failed sequence
    if (sequence_number != 0) console.log("sequence canceled");
    sequence_number = 0;
    return false;
  }
  if (modmach && codematch && newseqnum != 0) { // sequence started or is not finished yet
    console.log('sequence');
    sequence_number = newseqnum;
    current_sequence_keymap_array_index = i;
    return true;
  }
  if (modmach && codematch && newseqnum == 0) { // all sequence is done
    sequence_number = 0;
    console.log(KEYMAPS[i].desc);
    broadcastAction(KEYMAPS[i].action);
    return true;
  }
  return false;
}

const handleUserKeyPress = (event: KeyboardEvent) => {
  // console.log("keyboard keydown event: ", event);

  if (sequence_number != 0) { // we are in a sequence key
    event.preventDefault();
    checkKeyWithKeymapIndex(current_sequence_keymap_array_index, event);
  } else {
    for (let i = 0; i < KEYMAPS.length; i++) {
      if (checkKeyWithKeymapIndex(i, event)) {
        event.preventDefault();
        break; // break on valid sequence or match
      }
    }
  }
}

const eventKeyModifierMatch = (modString: string, event: KeyboardEvent) => {
  if (modString.includes("Shift") != event.shiftKey) return false;
  if (modString.includes("Ctrl") != event.ctrlKey) return false;
  if (modString.includes("Alt") != event.altKey) return false;
  if (modString.includes("Meta") != event.metaKey) return false;
  return true;
}

const eventKeyCodeMatch = (keys: string | Array<string>, sequence: number, event: KeyboardEvent) => {
  const code = event.code.replace("Key", "");
  if (typeof keys === 'string') {
    return { codematch: (code === keys), newseqnum: 0 };
  }

  if (Array.isArray(keys)) {
    console.log(keys, sequence, code);
    if ((sequence == (keys.length - 1)) && keys[sequence] === code) return { codematch: true, newseqnum: 0 };
    if ((sequence < (keys.length - 1)) && keys[sequence] === code) return { codematch: true, newseqnum: (sequence + 1) };
    return { codematch: false, newseqnum: 0 };
  }

  return { codematch: false, newseqnum: 0 };
}

const handleUserKeyPress_original = (event: KeyboardEvent) => {
  // console.log("keyboard keydown event: ", event);

  const noModifiers: boolean = (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey);
  const shiftOnly: boolean = (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey);
  const ctrlOnly: boolean = (!event.shiftKey && event.ctrlKey && !event.altKey && !event.metaKey);
  const altOnly: boolean = (!event.shiftKey && !event.ctrlKey && event.altKey && !event.metaKey);
  //const metaOnly: boolean = (!event.shiftKey && !event.ctrlKey && !event.altKey && event.metaKey);


  if (event.code === 'Enter' && altOnly) {
    event.preventDefault();
    broadcastAction(Action.toggleMaximizeWindow);
  }

  if (event.code === 'KeyQ' && altOnly) {
    event.preventDefault();
    broadcastAction(Action.closeWindow);
  }

  if (event.code === 'Escape') {
    event.preventDefault();
    broadcastAction(Action.escapePressed);
  }

  if (!insert_mode) {
    // console.log('event', event);
    const goNext: boolean =
      (event.code === 'KeyL' && noModifiers) || (event.code === 'ArrowRight' && noModifiers);
    if (goNext) {
      event.preventDefault();
      broadcastAction(Action.gotoNextTimePeriod);
    }

    const goPrevious: boolean =
      (event.code === 'KeyH' && noModifiers) || (event.code === 'ArrowLeft' && noModifiers);
    if (goPrevious) {
      event.preventDefault();
      broadcastAction(Action.gotoPreviousTimePeriod);
    }

    if (event.code === 'KeyT' && !event.shiftKey) {
      event.preventDefault();
      broadcastAction(Action.gotoCurrentTimePeriod);
    }

    const goNextWeek: boolean =
      (event.code === 'KeyW' && noModifiers);
    if (goNextWeek) {
      event.preventDefault();
      broadcastAction(Action.gotoNextWeek);
    }

    const goPreviousWeek: boolean =
      (event.code === 'KeyW' && shiftOnly);
    if (goPreviousWeek) {
      event.preventDefault();
      broadcastAction(Action.gotoPreviousWeek);
    }

    const goNextYear: boolean =
      (event.code === 'KeyO' && noModifiers);
    if (goNextYear) {
      event.preventDefault();
      broadcastAction(Action.displayObjectivesPage);
    }

    const switchObjectivesCalendar: boolean =
      (event.code === 'KeyS' && noModifiers);
    if (switchObjectivesCalendar) {
      event.preventDefault();
      broadcastAction(Action.switchObjectivesCalendar);
    }

    // const goPreviousYear: boolean =
    //   (event.code === 'KeyO' && shiftOnly);
    // if (goPreviousYear) {
    //   event.preventDefault();
    //   broadcastAction(Action.gotoPreviousYear);
    // }


    const selectNext: boolean = (event.code === 'ArrowDown' || event.code === 'KeyJ') && noModifiers;
    if (selectNext) {
      event.preventDefault();
      broadcastAction(Action.selectNextItem);
    }

    const selectPrevious: boolean = (event.code === 'ArrowUp' || event.code === 'KeyK') && noModifiers;
    if (selectPrevious) {
      event.preventDefault();
      broadcastAction(Action.selectPreviousItem);
    }

    if (event.code === 'KeyE' && noModifiers) {
      event.preventDefault();
      broadcastAction(Action.editSelectedItem);
    }

    // todo: should have some confirmation on delete!!
    // const deleteSelected: boolean = (event.code === 'KeyD' || event.code === 'Delete') && noModifiers;
    const deleteSelected: boolean = (event.code === 'Delete') && noModifiers;
    if (deleteSelected) {
      event.preventDefault();
      broadcastAction(Action.deleteSelectedItem);
    }

    // Ctrl-C: copy item's text
    if (event.code === 'KeyC' && ctrlOnly) {
      event.preventDefault();
      broadcastAction(Action.copySelectedItemText);
    }

    if (event.code === 'Space' && noModifiers) {
      event.preventDefault();
      broadcastAction(Action.toggleSelectedItemState);
    }

    // Ctrl-K or Ctrl-Up: move up
    const moveUp = (event.code === 'KeyK' || event.code === 'ArrowUp') && ctrlOnly;
    if (moveUp) {
      event.preventDefault();
      broadcastAction(Action.moveUpSelectedItem);
    }

    // Ctrl-J or Ctrl-Down: move down
    const moveDown = (event.code === 'KeyJ' || event.code === 'ArrowDown') && ctrlOnly;
    if (moveDown) {
      event.preventDefault();
      broadcastAction(Action.moveDownSelectedItem);
    }

    // Ctrl-L or Ctrl-Right: move item to next time period
    const moveNext = (event.code === 'KeyL' || event.code === 'ArrowRight') && ctrlOnly;
    if (moveNext) {
      event.preventDefault();
      broadcastAction(Action.moveSelectedItemToNextTimePeriod);
    }

    // Ctrl-H or Ctrl-Left: move item to previous time period
    const movePrevious = (event.code === 'KeyH' || event.code === 'ArrowLeft') && ctrlOnly;
    if (movePrevious) {
      event.preventDefault();
      broadcastAction(Action.moveSelectedItemToPreviousTimePeriod);
    }

    // new with N leader key
    if (!newKeyFlag && event.code === 'KeyN' && noModifiers) {
      event.preventDefault();
      newKeyFlag = true;
    } else if (newKeyFlag && event.code === 'KeyG' && noModifiers) { // new goal
      event.preventDefault();
      newKeyFlag = false;
      broadcastAction(Action.newGoal);
    } else if (newKeyFlag && event.code === 'KeyN' && noModifiers) { // new note
      event.preventDefault();
      newKeyFlag = false;
      broadcastAction(Action.newNote);
    } else if (newKeyFlag) {
      event.preventDefault();
      newKeyFlag = false;
    } else { }

    // copy with C leader key
    if (!copyKeyFlag && event.code === 'KeyC' && noModifiers) {
      event.preventDefault();
      copyKeyFlag = true;
    } else if (copyKeyFlag && event.code === 'KeyA' && noModifiers) { // copy all items
      event.preventDefault();
      copyKeyFlag = false;
      broadcastAction(Action.copyAllItems);
    } else if (copyKeyFlag && event.code === 'KeyC' && noModifiers) { // copy one item
      event.preventDefault();
      copyKeyFlag = false;
      broadcastAction(Action.copySelectedItemText);
    } else if (copyKeyFlag && event.code === 'KeyB' && noModifiers) { // create backup of db file
      event.preventDefault();
      copyKeyFlag = false;
      broadcastAction(Action.backupDbFile);
    } else if (copyKeyFlag) {
      event.preventDefault();
      copyKeyFlag = false;
    } else { }
  }
}

function set_insert_mode(mode: boolean) {
  insert_mode = mode;
}

function Keyboard() {
  console.log("keyboard function.");
}


export { init, Keyboard, set_insert_mode };
