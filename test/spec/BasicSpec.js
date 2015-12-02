(function() {
  "use strict";

  describe('SpeechKITT', function() {

    it('should exist in global namespace', function () {
      expect(window.SpeechKITT).toEqual(jasmine.any(Object));
    });

    it('should contain setStartCommand method', function () {
      expect(window.SpeechKITT.setStartCommand).toEqual(jasmine.any(Function));
    });

    it('should contain setAbortCommand method', function () {
      expect(window.SpeechKITT.setAbortCommand).toEqual(jasmine.any(Function));
    });

    it('should contain startRecognition method', function () {
      expect(window.SpeechKITT.startRecognition).toEqual(jasmine.any(Function));
    });

    it('should contain abortRecognition method', function () {
      expect(window.SpeechKITT.abortRecognition).toEqual(jasmine.any(Function));
    });

  });

  describe('SpeechKITT.setStartCommand', function() {

    it('should throw an error when called without a callback function', function () {
      expect(function() {
        window.SpeechKITT.setStartCommand();
      }).toThrowError();
    });

    it('should throw an error when called with an invalid callback function', function () {
      expect(function() {
        window.SpeechKITT.setStartCommand(undefined);
        window.SpeechKITT.setStartCommand('blerg');
      }).toThrowError();
    });

    //@TODO: define test different contexts

  });

  describe('SpeechKITT.setAbortCommand', function() {

    it('should throw an error when called without a callback function', function () {
      expect(function() {
        window.SpeechKITT.setAbortCommand();
      }).toThrowError();
    });

    it('should throw an error when called with an invalid callback function', function () {
      expect(function() {
        window.SpeechKITT.setAbortCommand(undefined);
        window.SpeechKITT.setAbortCommand('blerg');
      }).toThrowError();
    });

  });

  describe('SpeechKITT.startRecognition', function() {

    beforeEach(function() {
      window.Corti.patch();
    });

    afterEach(function() {
      window.Corti.unpatch();
    });

    it('should throw an error when called before setting a start command', function () {
      expect(function() {
        window.SpeechKITT.startRecognition();
      }).toThrowError();
    });

    it('should start SpeechRecognition', function () {
      window.SpeechKITT.setStartCommand(window.SpeechRecognition.start);
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechKITT.startRecognition();
      expect(window.SpeechRecognition.isStarted()).toBe(true);
      window.SpeechKITT.startRecognition();
      expect(window.SpeechRecognition.isStarted()).toBe(true);
    });

  });

  describe('SpeechKITT.abortRecognition', function() {

    beforeEach(function() {
      window.Corti.patch();
    });

    afterEach(function() {
      window.Corti.unpatch();
    });

    it('should throw an error when called before setting an abort command', function () {
      expect(function() {
        window.SpeechKITT.abortRecognition();
      }).toThrowError();
    });

    it('should abort SpeechRecognition', function () {
      window.SpeechKITT.setStartCommand(window.SpeechRecognition.start);
      window.SpeechKITT.setAbortCommand(window.SpeechRecognition.abort);
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechKITT.startRecognition();
      expect(window.SpeechRecognition.isStarted()).toBe(true);
      window.SpeechKITT.abortRecognition();
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechKITT.abortRecognition();
      expect(window.SpeechRecognition.isStarted()).toBe(false);
    });

  });

})();
