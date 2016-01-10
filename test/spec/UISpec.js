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

  var simulateClick = function(element) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, false);
    return element.dispatchEvent(event);
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
      expect(getToggleButtons()).toHaveLength(1);
      expect(getToggleButton()).toBeInDOM();
      expect(getToggleButton()).toBeVisible();
    });

    it('should add a label to the a#skitt-toggle-button', function () {
      expect(getToggleButtonLabels()).toHaveLength(1);
      expect(getToggleButtonLabel()).toBeInDOM();
      expect(getToggleButtonLabel()).toBeVisible();
    });

    it('should add label with default text of "Activate Voice Control"', function () {
      expect(getToggleButtonLabel().innerText).toEqual('Activate Voice Control');
    });

    it('should add listening text', function () {
      expect(getListeningTexts()).toHaveLength(1);
      expect(getListeningText()).toBeInDOM();
      expect(getListeningText()).toBeVisible();
    });

    it('should add instructions within listening text area', function () {
      expect(getInstructionsTexts()).toHaveLength(1);
      expect(getInstructionsText()).toBeInDOM();
      expect(getInstructionsText()).toBeVisible();
    });

    it('should add instructions with default text of "What can I help you with?"', function () {
      expect(getInstructionsText().innerText).toEqual('What can I help you with?');
    });

    it('should not add samples by default (until they have been set)', function () {
      expect(getSamplesTexts()).toHaveLength(0);
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

    it('should not attach a style sheet if non was defined', function () {
      SpeechKITT.abortRecognition();
      SpeechKITT.vroom();
      expect(getStyleSheets()).toHaveLength(0);
    });

    it('should attach a style sheet if one was defined with SpeechKITT.setStyle', function () {
      SpeechKITT.abortRecognition();
      SpeechKITT.setStylesheet('flat.css');
      SpeechKITT.vroom();
      expect(getStyleSheets()).toHaveLength(1);
      expect(getStyleSheet().id).toEqual('skitt-style-sheet');
      expect(getStyleSheet().rel).toEqual('stylesheet');
      expect(getStyleSheet().href).toContain('flat.css');
    });

    it('should change the stylesheet if it is called again', function () {
      SpeechKITT.abortRecognition();
      SpeechKITT.vroom();
      SpeechKITT.setStylesheet('style1.css');
      expect(getStyleSheets()).toHaveLength(1);
      expect(getStyleSheet().href).toContain('style1.css');
      SpeechKITT.setStylesheet('style2.css');
      expect(getStyleSheets()).toHaveLength(1);
      expect(getStyleSheet().href).not.toContain('style1.css');
      expect(getStyleSheet().href).toContain('style2.css');
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

  describe('SpeechKITT toggle button', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
      SpeechKITT.vroom();
      SpeechKITT.abortRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should turn on speech recognition when clicked', function () {
      expect(getWrapper()).toHaveClass('skitt-ui--not-listening');
      expect(recognition.isStarted()).toBe(false);
      simulateClick(getToggleButton());
      expect(getWrapper()).toHaveClass('skitt-ui--listening');
      expect(recognition.isStarted()).toBe(true);
    });

  });

  describe('SpeechKITT.setToggleLabelText', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
      SpeechKITT.vroom();
      SpeechKITT.abortRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should change the text of the toggle button label', function () {
      expect(getToggleButtonLabel().innerText).toEqual('Activate Voice Control');
      SpeechKITT.setToggleLabelText('Hi KITT');
      expect(getToggleButtonLabel().innerText).toEqual('Hi KITT');
    });

  });

  describe('SpeechKITT.setInstructionsText', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
      SpeechKITT.vroom();
      SpeechKITT.abortRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should change the text of the listening instructions', function () {
      expect(getInstructionsText().innerText).toEqual('What can I help you with?');
      SpeechKITT.setInstructionsText('Talk to me Goose!');
      expect(getInstructionsText().innerText).toEqual('Talk to me Goose!');
    });

  });

  describe('SpeechKITT.setSampleCommands', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
      SpeechKITT.vroom();
      SpeechKITT.abortRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should set the text of the sample commands and add it to the DOM', function () {
      expect(getSamplesTexts()).toHaveLength(0);
      SpeechKITT.setSampleCommands(['Show directions', 'Call restaurant']);
      expect(getSamplesTexts()).toHaveLength(1);
      expect(getSamplesText()).toBeInDOM();
      expect(getSamplesText()).toBeVisible();
      expect(getSamplesText().innerText).toEqual('Show directions. Call restaurant.');
    });

  });

  describe('SpeechKITT.rememberStatus', function() {

    var recognition;

    beforeEach(function() {
      jasmine.clock().install();
      Corti.patch();
      recognition = new SpeechRecognition();
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
      recognition.addEventListener('end', SpeechKITT.onEnd);
      SpeechKITT.vroom();
      SpeechKITT.abortRecognition();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
      Corti.unpatch();
    });

    it('should throw an error when called without a parameter or an invalid parameter', function () {
      expect(function() {
        SpeechKITT.rememberStatus();
      }).toThrowError();
      expect(function() {
        SpeechKITT.rememberStatus('Michael');
      }).toThrowError();
      expect(function() {
        SpeechKITT.rememberStatus(-12);
      }).toThrowError();
    });

    it('should accept one parameter which is an integer equal to or greater than zero', function () {
      expect(function() {
        SpeechKITT.rememberStatus(0);
      }).not.toThrowError();
      expect(function() {
        SpeechKITT.rememberStatus(Infinity);
      }).not.toThrowError();
      expect(function() {
        SpeechKITT.rememberStatus(60);
      }).not.toThrowError();
    });

    it('should save a cookie called `skittremember` that will expire n minutes after startRecognition() was last called', function () {
      expect(document.cookie.indexOf('skittremember')).toBe(-1);
      SpeechKITT.rememberStatus(60);
      SpeechKITT.vroom();
      expect(document.cookie.indexOf('skittremember')).toBe(-1);
      SpeechKITT.startRecognition();
      expect(document.cookie.indexOf('skittremember')).not.toBe(-1);
    });

    it('should clear the cookie called `skittremember` when abortRecognition() is called', function () {
      expect(document.cookie.indexOf('skittremember')).toBe(-1);
      SpeechKITT.startRecognition();
      expect(document.cookie.indexOf('skittremember')).not.toBe(-1);
      SpeechKITT.abortRecognition();
      expect(document.cookie.indexOf('skittremember')).toBe(-1);
    });

    it('should start listening immediately on render() if startRecognition() was previously called, abortRecognition() has not been called since and cookie hasn\'t expired', function () {
      expect(SpeechKITT.isListening()).toBe(false);
      expect(document.cookie.indexOf('skittremember')).toBe(-1);
      SpeechKITT.rememberStatus(60);
      SpeechKITT.render();
      expect(SpeechKITT.isListening()).toBe(false);
      SpeechKITT.startRecognition();
      expect(document.cookie.indexOf('skittremember')).not.toBe(-1);
      expect(SpeechKITT.isListening()).toBe(true);
      recognition.abort();
      jasmine.clock().tick(101);
      expect(SpeechKITT.isListening()).toBe(false);
      expect(document.cookie.indexOf('skittremember')).not.toBe(-1);
      SpeechKITT.render();
      expect(SpeechKITT.isListening()).toBe(true);
    });

  });

})();
