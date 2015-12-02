(function() {
  "use strict";

  describe('Corti', function() {

    it('should exist in global namespace', function () {
      expect(window.Corti).toEqual(jasmine.any(Object));
    });

    it('should contain patch method', function () {
      expect(window.Corti.patch).toEqual(jasmine.any(Function));
    });

    it('should contain unpatch method', function () {
      expect(window.Corti.unpatch).toEqual(jasmine.any(Function));
    });

  });

  describe('Corti.patch', function() {

    beforeEach(function() {
      window.Corti.patch();
    });

    afterEach(function() {
      window.Corti.unpatch();
    });

    it('should add the method isStarted', function () {
      expect(window.SpeechRecognition.isStarted).toEqual(jasmine.any(Function));
    });

    it('should add the method start', function () {
      expect(window.SpeechRecognition.start).toEqual(jasmine.any(Function));
    });

    it('should add the method abort', function () {
      expect(window.SpeechRecognition.abort).toEqual(jasmine.any(Function));
    });

  });

  describe('Corti.unpatch', function() {

    beforeEach(function() {
      window.Corti.patch();
      window.Corti.unpatch();
    });

    it('should make SpeechRecognition undefined', function () {
      expect(window.SpeechRecognition).toBeUndefined();
    });

  });

  describe('SpeechRecognition.start', function() {

    beforeEach(function() {
      window.Corti.patch();
    });

    afterEach(function() {
      window.Corti.unpatch();
    });

    it('should start SpeechRecognition', function () {
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechRecognition.start();
      expect(window.SpeechRecognition.isStarted()).toBe(true);
      window.SpeechRecognition.start();
      expect(window.SpeechRecognition.isStarted()).toBe(true);
    });

  });

  describe('SpeechRecognition.abort', function() {

    beforeEach(function() {
      window.Corti.patch();
    });

    afterEach(function() {
      window.Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechRecognition.start();
      expect(window.SpeechRecognition.isStarted()).toBe(true);
      window.SpeechRecognition.abort();
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechRecognition.abort();
      expect(window.SpeechRecognition.isStarted()).toBe(false);
    });

  });

  describe('SpeechRecognition.stop', function() {

    beforeEach(function() {
      window.Corti.patch();
    });

    afterEach(function() {
      window.Corti.unpatch();
    });

    it('should stop SpeechRecognition', function () {
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechRecognition.start();
      expect(window.SpeechRecognition.isStarted()).toBe(true);
      window.SpeechRecognition.stop();
      expect(window.SpeechRecognition.isStarted()).toBe(false);
      window.SpeechRecognition.stop();
      expect(window.SpeechRecognition.isStarted()).toBe(false);
    });

  });

})();
