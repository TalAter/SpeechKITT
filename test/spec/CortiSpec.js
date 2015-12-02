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

    beforeEach(function() {
      Corti.patch();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should add the method isStarted', function () {
      expect(SpeechRecognition.isStarted).toEqual(jasmine.any(Function));
    });

    it('should add the method start', function () {
      expect(SpeechRecognition.start).toEqual(jasmine.any(Function));
    });

    it('should add the method abort', function () {
      expect(SpeechRecognition.abort).toEqual(jasmine.any(Function));
    });

  });

  describe('Corti.unpatch', function() {

    beforeEach(function() {
      Corti.patch();
      Corti.unpatch();
    });

    it('should make SpeechRecognition undefined', function () {
      expect(SpeechRecognition).toBeUndefined();
    });

  });

  describe('SpeechRecognition.start', function() {

    beforeEach(function() {
      Corti.patch();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should start SpeechRecognition', function () {
      expect(SpeechRecognition.isStarted()).toBe(false);
      SpeechRecognition.start();
      expect(SpeechRecognition.isStarted()).toBe(true);
      SpeechRecognition.start();
      expect(SpeechRecognition.isStarted()).toBe(true);
    });

  });

  describe('SpeechRecognition.abort', function() {

    beforeEach(function() {
      Corti.patch();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(SpeechRecognition.isStarted()).toBe(false);
      SpeechRecognition.start();
      expect(SpeechRecognition.isStarted()).toBe(true);
      SpeechRecognition.abort();
      expect(SpeechRecognition.isStarted()).toBe(false);
      SpeechRecognition.abort();
      expect(SpeechRecognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechRecognition.stop', function() {

    beforeEach(function() {
      Corti.patch();
    });

    afterEach(function() {
      Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(SpeechRecognition.isStarted()).toBe(false);
      SpeechRecognition.start();
      expect(SpeechRecognition.isStarted()).toBe(true);
      SpeechRecognition.stop();
      expect(SpeechRecognition.isStarted()).toBe(false);
      SpeechRecognition.stop();
      expect(SpeechRecognition.isStarted()).toBe(false);
    });

  });

})();
