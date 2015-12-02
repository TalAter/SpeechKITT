//! Speech KITT
//! version : 0.1.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/SpeechKITT

(function (undefined) {
  "use strict";

  // Save a reference to the global object (window in the browser)
  var _root = this;

  // Expose functionality
  _root.SpeechKITT = {

    /**
     * Define the function that should be called in order to start speech recognition.
     *
     * #### Examples:
     * ````javascript
     * // Will call annyang's start method
     * SpeechKITT.setStartCommand(annyang.start);
     * // Will call a global function called listen with a local context.
     * SpeechKITT.setStartCommand(listen, this);
     * // Functions can also be stated by name (string)
     * SpeechKITT.setStartCommand('listen', this);
     * // Using the browser's native start function
     * SpeechKITT.setStartCommand(webkitSpeechRecognition.start);
     * ````
     *
     * @param {Function|String} callback - The function to call to start speech recognition
     * @param {Object} [context] - Optional context for the callback function
     * @method setStartCommand
     */
    setStartCommand: function(callback, context) {
      // This should work both when passed a function, or a name of a function
      callback = _root[callback] || callback;
      if (typeof callback !== 'function') {
        throw new TypeError('invalid callback function');
      }
      context = context || this;
    },

    /**
     * Define the function that should be called in order to abort (stop) speech recognition.
     *
     * #### Examples:
     * ````javascript
     * // Will call annyang's abort method
     * SpeechKITT.setAbortCommand(annyang.abort);
     * // Using the browser's native abort function
     * SpeechKITT.setAbortCommand(webkitSpeechRecognition.abort);
     * ````
     *
     * @param {Function|String} callback - The function to call to abort speech recognition
     * @param {Object} [context] - Optional context for the callback function
     * @method setAbortCommand
     */
    setAbortCommand: function(callback, context) {
      // This should work both when passed a function, or a name of a function
      callback = _root[callback] || callback;
      if (typeof callback !== 'function') {
        throw new TypeError('invalid callback function');
      }
      context = context || this;
    }

  };

}).call(this);
