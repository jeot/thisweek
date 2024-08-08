export function getDirection(text) {
  let direction = 'auto';
  if (text === undefined) return direction;
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

// convert English digits to Persian digits in a string
// ex: text.toPersianDigits()
String.prototype.toPersianDigits = function() {
  var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return this.replace(/[0-9]/g, function(w) {
    return id[+w]
  });
}
