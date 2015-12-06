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

    it('should contain onStart method', function () {
      expect(SpeechKITT.onStart).toEqual(jasmine.any(Function));
    });

    it('should contain onEnd method', function () {
      expect(SpeechKITT.onEnd).toEqual(jasmine.any(Function));
    });

    it('should contain start method', function () {
      expect(SpeechKITT.start).toEqual(jasmine.any(Function));
    });

    it('should contain vroom method', function () {
      expect(SpeechKITT.vroom).toEqual(jasmine.any(Function));
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
      expect(recognition.isStarted()).toBe(true);
    });

    it('should throw an exception if called on an already running SpeechRecognition object', function () {
      SpeechKITT.setStartCommand(recognition.start);
      expect(recognition.isStarted()).toBe(false);
      SpeechKITT.startRecognition();
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
      expect(recognition.isStarted()).toBe(true);
      SpeechKITT.abortRecognition();
      expect(recognition.isStarted()).toBe(false);
      SpeechKITT.abortRecognition();
      expect(recognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechKITT.onStart', function() {

    it('should be callable', function () {
      SpeechKITT.onStart();
    });

  });

  describe('SpeechKITT.onEnd', function() {

    it('should be callable', function () {
      SpeechKITT.onEnd();
    });

  });

})();
