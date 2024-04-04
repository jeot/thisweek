export function getDirection(text) {
  let direction = 'auto';
  // var x = new RegExp("[\x00-\x80]+"); // is ascii
  // var isAscii = x.test(text);
  var c = text.charCodeAt();
  var isAscii = (c < 0x7F);
  if (isAscii) {
    direction = 'ltr';
  } else {
    direction = 'rtl';
  }
  return direction;
}

