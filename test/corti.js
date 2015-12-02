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
  var productionVersion;

  var newSpeechRecognition = function() {
    var started = false;

    return {

      start: function() {
        started = true;
      },

      abort: function() {
        started = false;
      },

      stop: function() {
        this.abort();
      },

      isStarted: function() {
        return started;
      }
    };
  };

  // Expose functionality
  _root.Corti = {
    patch: function() {
      productionVersion = _root.SpeechRecognition ||
        _root.webkitSpeechRecognition ||
        _root.mozSpeechRecognition ||
        _root.msSpeechRecognition ||
        _root.oSpeechRecognition;
      _root.SpeechRecognition = newSpeechRecognition();
    },

    unpatch: function() {
      _root.SpeechRecognition = productionVersion;
    }
  };

}).call(this);
