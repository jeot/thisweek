import { ObjectiveType } from "./constants";

export function getDirection(text: string) {
  let direction = 'ltr';
  if (text === undefined || text === null) return direction;
  if (text.length == 0) return direction;
  // var x = new RegExp("[\x00-\x80]+"); // is ascii
  // var isAscii = x.test(text);
  var c = text.charCodeAt(0);
  var isAscii = (c < 0x7F);
  if (isAscii) {
    direction = 'ltr';
  } else {
    direction = 'rtl';
  }
  return direction;
}

export function toPersianDigits(text: string) {
  var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return text.replace(/[0-9]/g, function(w: any) {
    return id[+w]
  });
}

export function getObjectiveTypeFromFields(year: number | null, season: number | null, month: number | null) {
  const ot = month ? ObjectiveType.monthly
    : season ? ObjectiveType.seasonal
      : year ? ObjectiveType.yearly : ObjectiveType.none;
  return ot;
}

export function arraysAreEquals(array: Array<any>, array2: Array<any>) {
  if (!array || !array2)
    return false;
  if (array === array2)
    return true;
  if (array.length != array2.length)
    return false;
  for (var i = 0, l = array.length; i < l; i++) {
    if (array[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

export function arrayStartsWithSecondArray(array: Array<any>, array2: Array<any>) {
  if (!array || !array2)
    return false;
  if (array === array2)
    return true;
  if (array2.length == 0)
    return true;
  if (array.length < array2.length)
    return false;
  for (var i = 0, l = array2.length; i < l; i++) {
    if (array[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
