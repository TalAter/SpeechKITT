(function() {
  "use strict";

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
