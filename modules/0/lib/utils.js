/**
 * Misc utilities
 */

// Another trim function. The string function '.trim()' does NOT work in IE8
//
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

// make uppercase of the first letter of the string
if (typeof String.prototype.capitalize !== 'function') {
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
}

capitalizedFirstLetter = function(word) {
  return word.charAt(0).toUpperCase();
};
