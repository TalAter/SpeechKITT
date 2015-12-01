(function() {
  "use strict";

  describe('SpeechKITT', function() {

    it('should exist in global namespace', function () {
      expect(window.SpeechKITT).toEqual(jasmine.any(Object));
    });

    it('should contain setStart method', function () {
      expect(window.SpeechKITT.setStart).toEqual(jasmine.any(Function));
    });

    it('should contain setAbort method', function () {
      expect(window.SpeechKITT.setAbort).toEqual(jasmine.any(Function));
    });

  });

  describe('SpeechKITT.setStart', function() {

    it('should throw an error when called without a callback function', function () {
      expect(function() {
        window.SpeechKITT.setStart();
      }).toThrowError();
    });

    it('should throw an error when called with an invalid callback function', function () {
      expect(function() {
        window.SpeechKITT.setStart(undefined);
        window.SpeechKITT.setStart('blerg');
      }).toThrowError();
    });

    //@TODO: define test for how it should work

    //@TODO: define test different contexts

  });

  describe('SpeechKITT.setAbort', function() {

    it('should throw an error when called without a callback function', function () {
      expect(function() {
        window.SpeechKITT.setAbort();
      }).toThrowError();
    });

    it('should throw an error when called with an invalid callback function', function () {
      expect(function() {
        window.SpeechKITT.setAbort(undefined);
        window.SpeechKITT.setAbort('blerg');
      }).toThrowError();
    });

  });

})();
