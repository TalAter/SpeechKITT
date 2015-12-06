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
    var _self = this;
    _self._started = false;

    this.start = function() {
      if (_self._started) {
        throw new DOMException('Failed to execute \'start\' on \'SpeechRecognition\': recognition has already started.');
      }
      _self._started = true;
      if (typeof _self.onstart === 'function') {
        _self.onstart.call();
      }
    };

    this.abort = function() {
      if (!_self._started) {
        return;
      }
      _self._started = false;
      if (typeof _self.onend === 'function') {
        _self.onend.call();
      }
    };

    this.stop = function() {
      return this.abort();
    };

    this.isStarted = function() {
      return _self._started;
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
