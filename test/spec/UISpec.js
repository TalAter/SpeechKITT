(function() {
  "use strict";

  var getWrappers = function() {
    return $('div#skitt-ui');
  };

  var getWrapper = function() {
    return getWrappers()[0];
  };

  var getStartEndButtons = function() {
    return $('a#skitt-toggle-button', getWrapper());
  };

  var getStartEndButton = function() {
    return getStartEndButtons()[0];
  };

  describe('SpeechKITT.hide', function() {
    it('should throw error if called before render was called', function () {
      expect(getWrappers()).toHaveLength(0);
      expect(function() {
        SpeechKITT.hide();
      }).toThrowError();
      expect(getWrappers()).toHaveLength(0);
    });
  });

  describe('SpeechKITT.show', function() {
    it('should throw error if called before render was called', function () {
      expect(getWrappers()).toHaveLength(0);
      expect(function() {
        SpeechKITT.show();
      }).toThrowError();
      expect(getWrappers()).toHaveLength(0);
    });
  });

  describe('SpeechKITT.vroom', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should add a visible gui to the DOM inside a div#skitt-ui', function () {
      expect(getWrappers()).toHaveLength(0);
      SpeechKITT.vroom();
      expect(getWrappers()).toHaveLength(1);
      expect(getWrapper()).toBeInDOM();
      expect(getWrapper()).toBeVisible();
    });

    it('should add a visible start/end button to the wrapper a#skitt-toggle-button', function () {
      expect(getStartEndButtons()).toHaveLength(1);
      expect(getStartEndButton()).toBeInDOM();
      expect(getStartEndButton()).toBeVisible();
    });

    it('should start GUI in not listening mode', function () {
      SpeechKITT.abortRecognition();
      SpeechKITT.vroom();
      expect(getWrapper()).toHaveClass('skitt-ui--not-listening');
      expect(getWrapper()).not.toHaveClass('skitt-ui--listening');
    });

    it('should start GUI in listening mode if recognition previously started', function () {
      SpeechKITT.startRecognition();
      SpeechKITT.vroom();
      expect(getWrapper()).not.toHaveClass('skitt-ui--not-listening');
      expect(getWrapper()).toHaveClass('skitt-ui--listening');
    });

    it('should change the GUI based on listening mode', function () {
      SpeechKITT.abortRecognition();
      expect(getWrapper()).toHaveClass('skitt-ui--not-listening');
      expect(getWrapper()).not.toHaveClass('skitt-ui--listening');
      SpeechKITT.startRecognition();
      expect(getWrapper()).not.toHaveClass('skitt-ui--not-listening');
      expect(getWrapper()).toHaveClass('skitt-ui--listening');
    });

    it('should not panic when called more than once', function () {
      expect(getWrappers()).toHaveLength(1);
      expect(getWrapper()).toBeInDOM();
      expect(getWrapper()).toBeVisible();
      SpeechKITT.vroom();
      expect(getWrappers()).toHaveLength(1);
      expect(getWrapper()).toBeInDOM();
      expect(getWrapper()).toBeVisible();
    });

  });

  describe('SpeechKITT.hide', function() {

    beforeEach(function() {
      SpeechKITT.vroom();
    });

    it('should add skitt-ui--hidden class to the GUI', function () {
      SpeechKITT.show();
      expect(getWrapper()).not.toHaveClass('skitt-ui--hidden');
      SpeechKITT.hide();
      expect(getWrapper()).toHaveClass('skitt-ui--hidden');
    });

  });

  describe('SpeechKITT.show', function() {

    it('should remove skitt-ui--hidden class from the GUI', function () {
      SpeechKITT.hide();
      expect(getWrapper()).toHaveClass('skitt-ui--hidden');
      SpeechKITT.show();
      expect(getWrapper()).not.toHaveClass('skitt-ui--hidden');
    });

  });

})();
