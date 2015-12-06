(function() {
  "use strict";

  describe('Corti', function() {

    it('should exist in global namespace', function () {
      expect(Corti).toEqual(jasmine.any(Object));
    });

    it('should contain patch method', function () {
      expect(Corti.patch).toEqual(jasmine.any(Function));
    });

    it('should contain unpatch method', function () {
      expect(Corti.unpatch).toEqual(jasmine.any(Function));
    });

  });

  describe('Corti.patch', function() {

    it('should make SpeechRecognition defined', function () {
      expect(window.SpeechRecognition).toBeUndefined();
      Corti.patch();
      expect(window.SpeechRecognition).toBeDefined();
      Corti.unpatch();
    });

  });

  describe('Corti.unpatch', function() {

    it('should make SpeechRecognition undefined', function () {
      expect(window.SpeechRecognition).toBeUndefined();
      Corti.patch();
      expect(window.SpeechRecognition).toBeDefined();
      Corti.unpatch();
      expect(window.SpeechRecognition).toBeUndefined();
    });

  });

  describe('new SpeechRecognition', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should add the method isStarted', function () {
      expect(recognition.isStarted).toEqual(jasmine.any(Function));
    });

    it('should add the method start', function () {
      expect(recognition.start).toEqual(jasmine.any(Function));
    });

    it('should add the method abort', function () {
      expect(recognition.abort).toEqual(jasmine.any(Function));
    });

  });

  describe('SpeechRecognition.start', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should start SpeechRecognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
    });

    it('should throw an exception if called on an already running SpeechRecognition object', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      expect(function() {
        recognition.start();
      }).toThrowError();
    });

  });

  describe('SpeechRecognition.abort', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.abort();
      expect(recognition.isStarted()).toBe(false);
      recognition.abort();
      expect(recognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechRecognition.stop', function() {

    var recognition;

    beforeEach(function() {
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(recognition.isStarted()).toBe(false);
      recognition.start();
      expect(recognition.isStarted()).toBe(true);
      recognition.stop();
      expect(recognition.isStarted()).toBe(false);
      recognition.stop();
      expect(recognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechRecognition.onstart', function() {

    var spyOnStart;
    var recognition;

    beforeEach(function() {
      spyOnStart = jasmine.createSpy();
      Corti.patch();
      recognition = new window.SpeechRecognition();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should attach a callback to start event which will be called once on start', function () {
      expect(spyOnStart).not.toHaveBeenCalled();
      recognition.onstart = spyOnStart;
      recognition.start();
      expect(spyOnStart.calls.count()).toEqual(1);
      expect(function() {
        recognition.start();
      }).toThrowError();
      expect(spyOnStart.calls.count()).toEqual(1);
    });

  });

})();
