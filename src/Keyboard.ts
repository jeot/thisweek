import { KEYMAPS } from "./Keymaps";
import { Action } from "./constants";
import { arrayStartsWithSecondArray } from "./utilities";

let listeners: Array<(action: Action) => void> = [];
let insert_mode: boolean = false;

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
  // console.log("adding new keydown event listener");
  window.addEventListener("keydown", handleUserKeyPress);
  listeners = [];
  insert_mode = false;
}

let sequence_array: Array<String> = [];

const isModeMatch = (mode: string): boolean => {
  if (mode.includes("I") && insert_mode) return true;
  if (mode.includes("N") && !insert_mode) return true;
  return false;
}

const eventKeyCodeMatch = (keys: string | Array<string>, event: KeyboardEvent): { codematch: boolean, sequence_finished: boolean } => {
  const code = event.code.replace("Key", "");
  const i: number = sequence_array.length;
  if (typeof keys === 'string') {
    if (i > 0) // we are in a sequence, we don't check single key actions
      return { codematch: false, sequence_finished: true };
    else
      return { codematch: (code === keys), sequence_finished: true };
  }
  if (Array.isArray(keys)) {
    if (i >= keys.length)
      return { codematch: false, sequence_finished: true };
    if (arrayStartsWithSecondArray(keys, sequence_array) && keys[i] === code) {
      console.log(keys, i, code);
      if (i == (keys.length - 1))
        return { codematch: true, sequence_finished: true };
      if (i < (keys.length - 1))
        return { codematch: true, sequence_finished: false };
    }
  }
  return { codematch: false, sequence_finished: true };
}

const checkKeyWithKeymapIndex = (i: number, event: KeyboardEvent): { matched: boolean, finished: boolean } => {
  if (!isModeMatch(KEYMAPS[i].mode)) {
    return { matched: false, finished: true };
  }
  const modmach = eventKeyModifierMatch(KEYMAPS[i].mod, event);
  const { codematch, sequence_finished } = eventKeyCodeMatch(KEYMAPS[i].keys, event)
  if (!modmach || !codematch) { // not matched or failed sequence
    return { matched: false, finished: true };
  }
  if (modmach && codematch && !sequence_finished) { // sequence started or is not finished yet
    console.log('sequence');
    return { matched: true, finished: false };
  }
  if (modmach && codematch && sequence_finished) { // all sequence is done
    console.log('done');
    // console.log(KEYMAPS[i].desc);
    // broadcastAction(KEYMAPS[i].action);
    return { matched: true, finished: true };
  }
  return { matched: false, finished: true };
}

const handleUserKeyPress = (event: KeyboardEvent) => {
  // console.log("keyboard keydown event: ", event);
  let reset = true;
  for (let i = 0, len = KEYMAPS.length; i < len; i++) {
    // match: eather single key match or in a sequence match
    // finished: it was single key or the entier sequence is finished
    const { matched, finished } = checkKeyWithKeymapIndex(i, event);
    if (matched && finished) {
      event.preventDefault();
      console.log(KEYMAPS[i].desc);
      broadcastAction(KEYMAPS[i].action);
      break; // break on valid sequence or match
    } else if (finished) { // this didn't match, go to next one.
      console.log(".");
    } else if (matched) { // correct key in a sequence,
      reset = false;
      event.preventDefault();
      const code = event.code.replace("Key", "");
      sequence_array.push(code);
      break;
    } else { // this sould not happen!
      throw new Error("error! should not happen!");
    }
  }
  if (reset && sequence_array.length != 0) {
    sequence_array.length = 0;
    console.log("sequence reset");
  }
}

const eventKeyModifierMatch = (modString: string, event: KeyboardEvent) => {
  if (modString.includes("Shift") != event.shiftKey) return false;
  if (modString.includes("Ctrl") != event.ctrlKey) return false;
  if (modString.includes("Alt") != event.altKey) return false;
  if (modString.includes("Meta") != event.metaKey) return false;
  return true;
}

function set_insert_mode(mode: boolean) {
  insert_mode = mode;
}

function Keyboard() {
  console.log("keyboard function.");
}


export { init, Keyboard, set_insert_mode };
