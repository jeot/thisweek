// import { useState, useEffect } from "react";
// import React from "react";
// import ReactDOM from "react-dom/client";
import { Action } from "./constants";

let listeners: Array<(action: Action) => void> = [];
let insert_mode: boolean = false;
let newKeyFlag: boolean = false;
let copyKeyFlag: boolean = false;

export function listen(cb: (action: number) => void) {
  console.log("registering new callback for keyboard actions");
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

const handleUserKeyPress = (event: KeyboardEvent) => {
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
    const nextWeek: boolean =
      (event.code === 'KeyW' && noModifiers) || (event.code === 'KeyL' && noModifiers) || (event.code === 'ArrowRight' && noModifiers);
    if (nextWeek) {
      event.preventDefault();
      broadcastAction(Action.gotoNextTimePeriod);
    }

    const previousWeek: boolean =
      (event.code === 'KeyW' && shiftOnly) || (event.code === 'KeyH' && noModifiers) || (event.code === 'ArrowLeft' && noModifiers);
    if (previousWeek) {
      event.preventDefault();
      broadcastAction(Action.gotoPreviousTimePeriod);
    }

    if (event.code === 'KeyT' && !event.shiftKey) {
      event.preventDefault();
      broadcastAction(Action.gotoCurrentTimePeriod);
    }

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

    const deleteSelected: boolean = (event.code === 'KeyD' || event.code === 'Delete') && noModifiers;
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

    // Ctrl-L or Ctrl-Right: move item to next week
    const moveNext = (event.code === 'KeyL' || event.code === 'ArrowRight') && ctrlOnly;
    if (moveNext) {
      event.preventDefault();
      broadcastAction(Action.moveSelectedItemToNextWeek);
    }

    // Ctrl-H or Ctrl-Left: move item to previous week
    const movePrevious = (event.code === 'KeyH' || event.code === 'ArrowLeft') && ctrlOnly;
    if (movePrevious) {
      event.preventDefault();
      broadcastAction(Action.moveSelectedItemToPreviousWeek);
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

function init() {
  console.log("adding new keydown event listener");
  window.addEventListener("keydown", handleUserKeyPress);
  listeners = [];
  insert_mode = false;
  newKeyFlag = false;
  copyKeyFlag = false;
}

function set_insert_mode(mode: boolean) {
  insert_mode = mode;
}

function Keyboard() {
  console.log("keyboard function.");
}


export { init, Keyboard, set_insert_mode };
