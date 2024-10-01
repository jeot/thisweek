import { ObjectiveType } from "./constants";

export function getDirection(text: string) {
  let direction = 'auto';
  if (text === undefined) return direction;
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
