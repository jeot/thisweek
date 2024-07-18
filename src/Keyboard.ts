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
  if (event.code === 'Enter' && event.altKey) {
    event.preventDefault();
    broadcastAction(Action.toggleMaximizeWindow);
  }

  if (event.code === 'KeyQ' && event.altKey) {
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
      ((event.code === 'KeyW' || event.code === 'KeyL') && !event.shiftKey) || (event.code === 'ArrowRight');
    if (nextWeek) {
      event.preventDefault();
      broadcastAction(Action.showNextWeek);
    }

    const previousWeek: boolean =
      (event.code === 'KeyW' && event.shiftKey) || (event.code === 'KeyH' && !event.shiftKey) || (event.code === 'ArrowLeft');
    if (previousWeek) {
      event.preventDefault();
      broadcastAction(Action.showPreviousWeek);
    }

    if (event.code === 'KeyT' && !event.shiftKey) {
      event.preventDefault();
      broadcastAction(Action.showCurrentWeek);
    }

    const selectNext: boolean = (event.code === 'ArrowDown' || event.code === 'KeyJ') && !event.shiftKey;
    if (selectNext) {
      event.preventDefault();
      broadcastAction(Action.selectNextItem);
    }

    const selectPrevious: boolean = (event.code === 'ArrowUp' || event.code === 'KeyK') && !event.shiftKey;
    if (selectPrevious) {
      event.preventDefault();
      broadcastAction(Action.selectPreviousItem);
    }

    if (event.code === 'KeyE') {
      event.preventDefault();
      broadcastAction(Action.editSelectedItem);
    }

    if (event.code === 'KeyD' || event.code === 'Delete') {
      event.preventDefault();
      broadcastAction(Action.deleteSelectedItem);
    }

    if (event.code === 'KeyC' && event.ctrlKey) { // Ctrl-C
      event.preventDefault();
      broadcastAction(Action.copySelectedItemText);
    }

    if (event.code === 'Space' && !event.ctrlKey && !event.altKey && !event.shiftKey) { // Ctrl-C
      event.preventDefault();
      broadcastAction(Action.toggleSelectedItemState);
    }

    // new with N leader key
    if (!newKeyFlag && event.code === 'KeyN') {
      event.preventDefault();
      newKeyFlag = true;
    } else if (newKeyFlag && event.code === 'KeyG') { // new goal
      event.preventDefault();
      newKeyFlag = false;
      broadcastAction(Action.newGoal);
    } else if (newKeyFlag && event.code === 'KeyN') { // new note
      event.preventDefault();
      newKeyFlag = false;
      broadcastAction(Action.newNote);
    } else if (newKeyFlag) {
      event.preventDefault();
      newKeyFlag = false;
    } else { }

    // copy with C leader key
    if (!copyKeyFlag && event.code === 'KeyC') {
      event.preventDefault();
      copyKeyFlag = true;
    } else if (copyKeyFlag && event.code === 'KeyA') { // copy all items
      event.preventDefault();
      copyKeyFlag = false;
      broadcastAction(Action.copyAllItems);
    } else if (event.code === 'KeyC') {
      event.preventDefault();
      copyKeyFlag = false;
      broadcastAction(Action.copySelectedItemText);
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
