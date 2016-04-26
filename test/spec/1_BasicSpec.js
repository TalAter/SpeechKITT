(function() {
  "use strict";

  describe('SpeechKITT', function() {

    it('should exist in global namespace', function () {
      expect(SpeechKITT).toEqual(jasmine.any(Object));
    });

    it('should contain setStartCommand method', function () {
      expect(SpeechKITT.setStartCommand).toEqual(jasmine.any(Function));
    });

    it('should contain setAbortCommand method', function () {
      expect(SpeechKITT.setAbortCommand).toEqual(jasmine.any(Function));
    });

    it('should contain startRecognition method', function () {
      expect(SpeechKITT.startRecognition).toEqual(jasmine.any(Function));
    });

    it('should contain abortRecognition method', function () {
      expect(SpeechKITT.abortRecognition).toEqual(jasmine.any(Function));
    });

    it('should contain toggleRecognition method', function () {
      expect(SpeechKITT.toggleRecognition).toEqual(jasmine.any(Function));
    });

    it('should contain onStart method', function () {
      expect(SpeechKITT.onStart).toEqual(jasmine.any(Function));
    });

    it('should contain onEnd method', function () {
      expect(SpeechKITT.onEnd).toEqual(jasmine.any(Function));
    });

    it('should contain render method', function () {
      expect(SpeechKITT.render).toEqual(jasmine.any(Function));
    });

    it('should contain vroom method', function () {
      expect(SpeechKITT.vroom).toEqual(jasmine.any(Function));
    });

    it('should contain hide method', function () {
      expect(SpeechKITT.hide).toEqual(jasmine.any(Function));
    });

    it('should contain show method', function () {
      expect(SpeechKITT.show).toEqual(jasmine.any(Function));
    });

    it('should contain isListening method', function () {
      expect(SpeechKITT.isListening).toEqual(jasmine.any(Function));
    });

    it('should contain setStylesheet method', function () {
      expect(SpeechKITT.setStylesheet).toEqual(jasmine.any(Function));
    });

    it('should contain setToggleLabelText method', function () {
      expect(SpeechKITT.setToggleLabelText).toEqual(jasmine.any(Function));
    });

    it('should contain getInstructionsText method', function () {
      expect(SpeechKITT.setInstructionsText).toEqual(jasmine.any(Function));
    });

    it('should contain setSampleCommands method', function () {
      expect(SpeechKITT.setSampleCommands).toEqual(jasmine.any(Function));
    });

    it('should contain annyang method', function () {
      expect(SpeechKITT.annyang).toEqual(jasmine.any(Function));
    });

    it('should contain rememberStatus method', function () {
      expect(SpeechKITT.rememberStatus).toEqual(jasmine.any(Function));
    });

    it('should contain setRecognizedSentence method', function () {
      expect(SpeechKITT.setRecognizedSentence).toEqual(jasmine.any(Function));
    });

    it('should contain getLastRecognizedSentence method', function () {
      expect(SpeechKITT.getLastRecognizedSentence).toEqual(jasmine.any(Function));
    });

    it('should contain displayRecognizedSentence method', function () {
     expect(SpeechKITT.displayRecognizedSentence).toEqual(jasmine.any(Function));
    });

  });

  describe('Initial state', function() {

    describe('SpeechKITT.getLastRecognizedSentence', function() {

      it('should return undefined if called before anything said', function () {
        expect(SpeechKITT.getLastRecognizedSentence()).toBe(undefined);
      });

    });

  });

  describe('SpeechKITT.setStartCommand', function() {

    it('should throw an error when called without a callback function', function () {
      expect(function() {
        SpeechKITT.setStartCommand();
      }).toThrowError();
    });

    it('should throw an error when called with an invalid callback function', function () {
      expect(function() {
        SpeechKITT.setStartCommand('blerg');
      }).toThrowError();
    });

    it('should throw an error when called with an undefined callback function', function () {
      expect(function() {
        SpeechKITT.setStartCommand(undefined);
      }).toThrowError();
    });

    //@TODO: define a test for different contexts

  });

  describe('SpeechKITT.setAbortCommand', function() {

    it('should throw an error when called without a callback function', function () {
      expect(function() {
        SpeechKITT.setAbortCommand();
      }).toThrowError();
    });

    it('should throw an error when called with an invalid callback function', function () {
      expect(function() {
        SpeechKITT.setAbortCommand('blerg');
      }).toThrowError();
    });

    it('should throw an error when called with an undefined callback function', function () {
      expect(function() {
        SpeechKITT.setAbortCommand(undefined);
      }).toThrowError();
    });

  });

  describe('SpeechKITT.startRecognition', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should throw an error when called before setting a start command', function () {
      expect(function() {
        SpeechKITT.startRecognition();
      }).toThrowError();
    });

    it('should start SpeechRecognition', function () {
      SpeechKITT.setStartCommand(recognition.start);
      expect(recognition.isStarted()).toBe(false);
      SpeechKITT.startRecognition();
      expect(SpeechKITT.isListening()).toBe(true);
      expect(recognition.isStarted()).toBe(true);
    });

    it('should throw an exception if called on an already running SpeechRecognition object', function () {
      SpeechKITT.setStartCommand(recognition.start);
      expect(recognition.isStarted()).toBe(false);
      SpeechKITT.startRecognition();
      expect(SpeechKITT.isListening()).toBe(true);
      expect(recognition.isStarted()).toBe(true);
      expect(function() {
        SpeechKITT.startRecognition();
      }).toThrowError();
    });

  });

  describe('SpeechKITT.abortRecognition', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should throw an error when called before setting an abort command', function () {
      expect(function() {
        SpeechKITT.abortRecognition();
      }).toThrowError();
    });

    it('should abort SpeechRecognition', function () {
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
      expect(recognition.isStarted()).toBe(false);
      SpeechKITT.startRecognition();
      expect(SpeechKITT.isListening()).toBe(true);
      expect(recognition.isStarted()).toBe(true);
      SpeechKITT.abortRecognition();
      expect(SpeechKITT.isListening()).toBe(false);
      expect(recognition.isStarted()).toBe(false);
      SpeechKITT.abortRecognition();
      expect(SpeechKITT.isListening()).toBe(false);
      expect(recognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechKITT.toggleRecognition', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should alternate between aborting and starting SpeechRecognition', function () {
      SpeechKITT.setStartCommand(recognition.start);
      SpeechKITT.setAbortCommand(recognition.abort);
      SpeechKITT.startRecognition();
      expect(recognition.isStarted()).toBe(true);
      expect(SpeechKITT.isListening()).toBe(true);
      SpeechKITT.toggleRecognition();
      expect(recognition.isStarted()).toBe(false);
      expect(SpeechKITT.isListening()).toBe(false);
      SpeechKITT.toggleRecognition();
      expect(recognition.isStarted()).toBe(true);
      expect(SpeechKITT.isListening()).toBe(true);
      SpeechKITT.toggleRecognition();
    });

  });

  describe('SpeechKITT.isListening', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should return false initially', function () {
      expect(SpeechKITT.isListening()).toBe(false);
    });

    it('should return true after starting SpeechKITT', function () {
      SpeechKITT.setStartCommand(recognition.start);
      expect(SpeechKITT.isListening()).toBe(false);
      SpeechKITT.startRecognition();
      expect(SpeechKITT.isListening()).toBe(true);
    });

  });

  describe('SpeechKITT.annyang', function() {

    var recognition;

    beforeEach(function() {
      jasmine.clock().install();
      recognition = annyang.getSpeechRecognizer();
      annyang.removeCommands();
      annyang.addCommands({
        'Time for some thrilling :action': function() {}
      });
    });

    afterEach(function() {
      annyang.abort();
      jasmine.clock().tick(101);
      jasmine.clock().uninstall();
    });

    it('should set start command to annyang.start', function () {
      expect(annyang.isListening()).toBe(false);
      SpeechKITT.annyang();
      SpeechKITT.startRecognition();
      expect(annyang.isListening()).toBe(true);
    });

    it('should set abort command to annyang.abort', function () {
      expect(annyang.isListening()).toBe(false);
      SpeechKITT.annyang();
      SpeechKITT.startRecognition();
      expect(annyang.isListening()).toBe(true);
      SpeechKITT.abortRecognition();
      expect(annyang.isListening()).toBe(false);
    });

    it('should add a callback to SpeechKITT.onStart to annyang\'s start event', function () {
      SpeechKITT.annyang();
      expect(SpeechKITT.isListening()).toBe(false);
      annyang.start();
      expect(SpeechKITT.isListening()).toBe(true);
    });

    it('should add a callback to SpeechKITT.onEnd to annyang\'s end event', function () {
      SpeechKITT.annyang();
      annyang.start();
      expect(SpeechKITT.isListening()).toBe(true);
      annyang.abort();
      jasmine.clock().tick(101);
      expect(SpeechKITT.isListening()).toBe(false);
    });

    it('should capture recognized sentence from `resultMatch` event and call SpeechKITT.setRecognizedSentence()', function () {
      var sentence = 'Time for some thrilling heroics';
      SpeechKITT.annyang();
      annyang.start();
      recognition.say(sentence);
      expect(SpeechKITT.getLastRecognizedSentence()).toBe(sentence);
    });

    it('should capture most probable sentence from `resultNoMatch` event and call SpeechKITT.setRecognizedSentence()', function () {
      var sentence = "You can't take the sky from me";
      SpeechKITT.annyang();
      annyang.start();
      recognition.say(sentence);
      expect(SpeechKITT.getLastRecognizedSentence()).toBe(sentence);
    });

  });

  describe('SpeechKITT.onStart', function() {

    it('should set Speech KITT to listening mode if it was not already listening', function () {
      expect(SpeechKITT.isListening()).toBe(false);
      SpeechKITT.onStart();
      expect(SpeechKITT.isListening()).toBe(true);
    });

    it('should leave Speech KITT in listening mode if it was already listening', function () {
      expect(SpeechKITT.isListening()).toBe(true);
      SpeechKITT.onStart();
      expect(SpeechKITT.isListening()).toBe(true);
    });

  });

  describe('SpeechKITT.onEnd', function() {

    beforeEach(function() {
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('should set Speech KITT to not listening mode if it was listening only after 100ms have passed without it being restarted', function () {
      expect(SpeechKITT.isListening()).toBe(true);
      SpeechKITT.onEnd();
      expect(SpeechKITT.isListening()).toBe(true);
      jasmine.clock().tick(101);
      expect(SpeechKITT.isListening()).toBe(false);
    });

    it('should leave Speech KITT in listening mode if it was called, but then onStart was called within 100ms', function () {
      SpeechKITT.startRecognition();
      expect(SpeechKITT.isListening()).toBe(true);
      SpeechKITT.onEnd();
      expect(SpeechKITT.isListening()).toBe(true);
      SpeechKITT.onStart();
      jasmine.clock().tick(101);
      expect(SpeechKITT.isListening()).toBe(true);
    });

    it('should leave Speech KITT in not listening mode if it was not listening', function () {
      SpeechKITT.abortRecognition();
      expect(SpeechKITT.isListening()).toBe(false);
      SpeechKITT.onEnd();
      expect(SpeechKITT.isListening()).toBe(false);
    });

  });

  describe('SpeechKITT.getLastRecognizedSentence', function() {

    it('should return the last said sentence if one was set by setRecognizedSentence', function () {
      var sentence1 = 'Next time you want to stab me in the back, have the guts to do it to my face';
      var sentence2 = "Man walks down the street in a hat like that, you know he's not afraid of anything";
      SpeechKITT.setRecognizedSentence(sentence1);
      SpeechKITT.setRecognizedSentence(sentence2);
      expect(SpeechKITT.getLastRecognizedSentence()).toEqual(sentence2);
    });

  });

  describe('SpeechKITT.setRecognizedSentence', function() {

    var sentence = 'Next time you want to stab me in the back, have the guts to do it to my face';

    it('should always return undefined', function () {
      expect(SpeechKITT.setRecognizedSentence()).toBe(undefined);
      expect(SpeechKITT.setRecognizedSentence(sentence)).toBe(undefined);
    });

    it('should add the sentence said to Speech KITT', function () {
      SpeechKITT.setRecognizedSentence(sentence);
      expect(SpeechKITT.getLastRecognizedSentence()).toEqual(sentence);
    });

  });

})();
