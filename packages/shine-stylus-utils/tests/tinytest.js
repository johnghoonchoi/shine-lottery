
//https://github.com/mquandalle/meteor-stylus/blob/master/tests/tinytest.js

var setDomElement = function (domStr, testFunc) {
  var div = document.createElement('div');
  div.innerHTML = domStr;
  div.style.display = 'block';
  document.body.appendChild(div);
  var p = div.firstChild;
  testFunc.call(p);
  document.body.removeChild(div);
};

var setStylusClass = function (className, testFunc) {
  return setDomElement('<p class="stylus-' + className + '"></p>', testFunc);
};

Tinytest.add("stylus - jeet", function(test) {
  setStylusClass('jeet-center', function () {
    test.equal(getStyleProperty(this, 'max-width'), "1337px");
  });
});

Tinytest.add("stylus - rupture", function(test) {
  setStylusClass('rupture-aboveOneIsBlack', function () {
    test.equal(getStyleProperty(this, 'color'), "rgb(0, 0, 0)");
  });
});

Tinytest.add("stylus - axis", function(test) {
  setStylusClass('axis-pre', function () {
    test.equal(getStyleProperty(this, 'white-space'), "pre-wrap");
  });
});

Tinytest.add("stylus - typographic", function(test) {
  setDomElement('<h1 class="stylus-typographic-h1"></h1>', function () {
    // Different browser agents format the `font-family` string in different
    // ways -- for instance Chrome uses single quote ' whereas Firefox uses
    // double quotes " to wrapped multi-words font names. To handle all the case
    // we interpret the given string as a list of font independently of the
    // browser specifics formatting.
    var fontString = getStyleProperty(this, 'font-family');
    var fontList = fontString.replace(/['"]/g, '').split(/, ?/);
    var expected = ['Garamond', 'Baskerville', 'Baskerville Old Face',
                    'Hoefler Text', 'Times New Roman', 'serif'];
    test.equal(fontList, expected);
  })
});
