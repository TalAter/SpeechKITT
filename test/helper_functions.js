var getWrappers = function() {
  return $('div#skitt-ui');
};

var getWrapper = function() {
  return getWrappers()[0];
};

var getToggleButtons = function() {
  return $('a#skitt-toggle-button', getWrapper());
};

var getToggleButton = function() {
  return getToggleButtons()[0];
};

var getToggleButtonLabels = function() {
  return $('label#skitt-toggle-button__label', getWrapper());
};

var getToggleButtonLabel = function() {
  return getToggleButtonLabels()[0];
};

var getStyleSheets = function() {
  return $('#skitt-style-sheet');
};

var getStyleSheet = function() {
  return getStyleSheets()[0];
};

var getListeningTexts = function() {
  return $('#skitt-listening-text');
};

var getListeningText = function() {
  return getListeningTexts()[0];
};

var getInstructionsTexts = function() {
  return $('#skitt-listening-text__instructions', getListeningTexts()[0]);
};

var getInstructionsText = function() {
  return getInstructionsTexts()[0];
};

var getSamplesTexts = function() {
  return $('#skitt-listening-text__samples', getListeningTexts()[0]);
};

var getSamplesText = function() {
  return getSamplesTexts()[0];
};

var getLastSentenceTexts = function () {
  return $('#skitt-listening-text__recognized-sentence', getWrapper());
};

var getLastSentenceText = function () {
  return getLastSentenceTexts()[0];
};

var simulateClick = function(element) {
  var event = document.createEvent("MouseEvents");
  event.initEvent("click", true, false);
  return element.dispatchEvent(event);
};