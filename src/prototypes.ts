// convert English digits to Persian digits in a string
// ex: text.toPersianDigits()
String.prototype.toPersianDigits = function() {
  var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return this.replace(/[0-9]/g, function(w) {
    return id[+w]
  });
}
