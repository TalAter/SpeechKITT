//! Speech KITT
//! version : 0.1.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/SpeechKITT

(function (undefined) {
  "use strict";

  // Save a reference to the global object (window in the browser)
  var _root = this;

  var _startCommand;
  var _abortCommand;

  // Is speech recognition on?
  var _statusOn = false;

  // DOM elements
  var _guiNodes;

  var _createGUI = function() {
    var wrapper = document.createElement('div');
    wrapper.id = 'skitt_wrapper';
    wrapper.innerHTML = '<a href="#" id="skitt_start_end_btn">&nbsp;</a>';
    return wrapper;
  };

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

      _startCommand = {callback: callback, context: context};
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

      _abortCommand = {callback: callback, context: context};
    },

    /**
     * Starts the speech recognition. Make sure to define the speech recognition command start first using setStartCommand()
     *
     * @method startRecognition
     */
    startRecognition: function() {
      if (!_startCommand) {
        throw new TypeError('cannot start recognition. Start command not defined');
      }
      _startCommand.callback.apply(_startCommand.context);
      _statusOn = true;
    },

    /**
     * Aborts the speech recognition. Make sure to define the speech recognition abort command first using setStartCommand()
     *
     * @method abortRecognition
     */
    abortRecognition: function() {
      if (!_abortCommand) {
        throw new TypeError('cannot abort recognition. Abort command not defined');
      }
      _abortCommand.callback.apply(_abortCommand.context);
      _statusOn = false;
    },

    /**
     * This function should be called when the browser's SpeechRecognition start event fires.
     * Attach this function to the Speech Recognition instance's start event.
     *
     * #### Examples:
     * ````javascript
     * var recognition = new webkitSpeechRecognition();
     * recognition.addEventListener('start', SpeechKITT.onStart);
     * ````
     *
     * @method onStart
     */
    onStart: function() {
      _statusOn = true;
    },

    /**
     * This function should be called when the browser's SpeechRecognition end event fires.
     * Attach this function to the Speech Recognition instance's end event.
     *
     * #### Examples:
     * ````javascript
     * var recognition = new webkitSpeechRecognition();
     * recognition.addEventListener('end', SpeechKITT.onEnd);
     * ````
     *
     * @method onEnd
     */
    onEnd: function() {
      _statusOn = false;
    },

    /**
     * Call once done configuring KITT, to render its interface.
     *
     * @method render
     */
    render: function() {
      if (_guiNodes === undefined) {
        _guiNodes = _createGUI();
        document.body.appendChild(_guiNodes);
      }
      //@TODO: set GUI status
    },

    /**
     * Call once done configuring KITT, to render its interface.
     * Identical to calling SpeechKITT.render();
     *
     * @method vroom
     * @see [render()](#render)
     */
    vroom: function() {
      this.render();
    },

    /**
     * Returns true if Speech Recognition is currently on.
     *
     * This can be wrong KITT wasn't completely configured correctly, or was started
     * while Speech Recognition was already running/
     *
     * @returns {boolean} true = listening
     * @method isListening
     */
    isListening: function() {
      return _statusOn;
    }

  };

}).call(this);
