

/*
saveSelection = function(containerEl) {
  var selectedTextRange = document.selection.createRange();
  var preSelectionTextRange = document.body.createTextRange();
  preSelectionTextRange.moveToElementText(containerEl);
  preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
  var start = preSelectionTextRange.text.length;

  return {
    start: start,
    end: start + selectedTextRange.text.length
  }
};

restoreSelection = function(containerEl, savedSel) {
  var textRange = document.body.createTextRange();
  textRange.moveToElementText(containerEl);
  textRange.collapse(true);
  textRange.moveEnd("character", savedSel.end);
  textRange.moveStart("character", savedSel.start);
  textRange.select();
};


createLink = function(matchedTextNode) {
  var el = document.createElement("a");
  el.href = matchedTextNode.data;
  el.appendChild(matchedTextNode);
  return el;
};

shouldLinkifyContents = function(el) {
  return el.tagName != "A";
};

surroundInElement = function(el, regex, surrounderCreateFunc, shouldSurroundFunc) {
  var child = el.lastChild;
  while (child) {
    if (child.nodeType == 1 && shouldSurroundFunc(el)) {
      surroundInElement(child, regex, createLink, shouldSurroundFunc);
    } else if (child.nodeType == 3) {
      surroundMatchingText(child, regex, surrounderCreateFunc);
    }
    child = child.previousSibling;
  }
};

surroundMatchingText = function(textNode, regex, surrounderCreateFunc) {
  var parent = textNode.parentNode;
  var result, surroundingNode, matchedTextNode, matchLength, matchedText;
  while ( textNode && (result = regex.exec(textNode.data)) ) {
    matchedTextNode = textNode.splitText(result.index);
    matchedText = result[0];
    matchLength = matchedText.length;
    textNode = (matchedTextNode.length > matchLength) ?
      matchedTextNode.splitText(matchLength) : null;
    surroundingNode = surrounderCreateFunc(matchedTextNode.cloneNode(true));
    parent.insertBefore(surroundingNode, matchedTextNode);
    parent.removeChild(matchedTextNode);
  }
};


var urlRegex = /http(s?):\/\/($|[^ ]+)/;

updateLinks = function(textBox) {

  var savedSelection = saveSelection(textBox);

  console.log('savedSelection: ', savedSelection);

  surroundInElement(textBox, urlRegex, createLink, shouldLinkifyContents);

  restoreSelection(textBox, savedSelection);
};


//getFirstRange = function() {
//  var sel = rangy.getSelection();
//  return sel.rangeCount ? sel.getRangeAt(0) : null;
//};





isSafari = navigator.appVersion.search('Safari') != -1 && navigator.appVersion.search('Chrome') == -1 && navigator.appVersion.search('CrMo') == -1 && navigator.appVersion.search('CriOS') == -1;

isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 || navigator.userAgent.toLowerCase().indexOf("trident") != -1);



var textToCopy = '';
var htmlToCopy = '';

ieClipboardDiv = $('#ie-clipboard-contenteditable');
hiddenInput = $("#hidden-input");

var userInput = "";

hiddenInputListener = function(text) {};

focusHiddenArea = function() {
  // In order to ensure that the browser will fire clipboard events, we always need to have something selected
  hiddenInput.val(' ');
  hiddenInput.focus().select();
};

// Focuses an element to be ready for copy/paste (used exclusively for IE)
focusIeClipboardDiv = function() {
  ieClipboardDiv.focus();
  var range = document.createRange();
  range.selectNodeContents((ieClipboardDiv.get(0)));
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

// For IE, we can get/set Text or URL just as we normally would, but to get HTML,
// we need to let the browser perform the copy or paste in a contenteditable div.

ieClipboardEvent = function(clipboardEvent) {

  var clipboardData = window.clipboardData;

  if (clipboardEvent == 'cut' || clipboardEvent == 'copy') {

    clipboardData.setData('Text', textToCopy);

    ieClipboardDiv.html(htmlToCopy);

    focusIeClipboardDiv();

    setTimeout(function() {
      focusHiddenArea();
      ieClipboardDiv.empty();
    }, 0);
  }
  if (clipboardEvent == 'paste') {
    var clipboardText = clipboardData.getData('Text');
    ieClipboardDiv.empty();
    setTimeout(function() {
      console.log('Clipboard Plain Text: ' + clipboardText);
      console.log('Clipboard HTML: ' + ieClipboardDiv.html());
      ieClipboardDiv.empty();
      focusHiddenArea();
    }, 0);
  }
};

// For every broswer except IE, we can easily get and set data on the clipboard
standardClipboardEvent = function(clipboardEvent, event) {

  var clipboardData = event.clipboardData;

  if (clipboardEvent == 'cut' || clipboardEvent == 'copy') {

    clipboardData.setData('text/plain', textToCopy);

    clipboardData.setData('text/html', htmlToCopy);

  }

  if (clipboardEvent == 'paste') {

    console.log('Clipboard Plain Text: ' + clipboardData.getData('text/plain'));

    console.log('Clipboard HTML: ' + clipboardData.getData('text/html'));

    return clipboardData.getData('text/plain');
  }
};

// For IE, the broswer will only paste HTML if a contenteditable div is selected before paste.
// Luckily, the browser fires
// a before paste event which lets us switch the focus elm to the appropraite element
if (isIe) {
  document.addEventListener('beforepaste', function() {
    if (hiddenInput.is(':focus')) {
      focusIeClipboardDiv();
    }
  }, true);
}

// We need the hidden input to constantly be selected in case there is a copy or paste event.
// It also recieves and dispatches input events
hiddenInput.on('input', function(e) {
  var value = hiddenInput.val();
  userInput += value;
  hiddenInputListener(userInput);

  // There is a bug (sometimes) with Safari and the input area can't be updated during
  // the input event, so we update the input area after the event is done being processed
  if (isSafari) {
    hiddenInput.focus();
    setTimeout(focusHiddenArea, 0);
  } else {
    focusHiddenArea();
  }
});

// Keep the hidden text area selected
$(document).mouseup(focusHiddenArea);
*/