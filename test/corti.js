//! Corti - Replaces the browser's SpeechRecognition with a fake object.
//! version : 0.1.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/SpeechKITT/test/corti.js

(function (undefined) {
  "use strict";

  // Save a reference to the global object (window in the browser)
  var _root = this;

  // Holds the browser's implementation
  var _productionVersion = false;

  // Patch DOMException
  var DOMException = DOMException || TypeError;

  var newSpeechRecognition = function() {
    var _started = false;

    this.start = function() {
      if (_started) {
        throw new DOMException('Failed to execute \'start\' on \'SpeechRecognition\': recognition has already started.');
      }
      _started = true;
    };

    this.abort = function() {
      _started = false;
    };

    this.stop = function() {
      _started = false;
    };

    this.isStarted = function() {
      return _started;
    };
  };

  // Expose functionality
  _root.Corti = {
    patch: function() {
      if (_productionVersion === false) {
        _productionVersion = _root.SpeechRecognition ||
          _root.webkitSpeechRecognition ||
          _root.mozSpeechRecognition ||
          _root.msSpeechRecognition ||
          _root.oSpeechRecognition;
      }
      _root.SpeechRecognition = newSpeechRecognition;
    },

    unpatch: function() {
      _root.SpeechRecognition = _productionVersion;
    }
  };

}).call(this);
