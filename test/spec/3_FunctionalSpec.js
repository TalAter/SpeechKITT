(function() {
  "use strict";

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

  var simulateClick = function(element) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, false);
    return element.dispatchEvent(event);
  };

  describe('SpeechKITT toggle button', function() {

    beforeEach(function() {
      SpeechKITT.abortRecognition();
    });

    it('should turn speech recognition on when pressed while it is off', function () {
      expect(SpeechKITT.isListening()).toBe(false);
      simulateClick(getToggleButton());
      expect(SpeechKITT.isListening()).toBe(true);
    });

    it('should turn speech recognition off when pressed while it is on', function () {
      SpeechKITT.startRecognition();
      expect(SpeechKITT.isListening()).toBe(true);
      simulateClick(getToggleButton());
      expect(SpeechKITT.isListening()).toBe(false);
    });

  });

})();
