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
  var _statusListening = false;

  // URL to the stylesheet to use
  var _stylesheet;
  var _stylesheetNode;

  var _toggleLabelText = 'Activate Voice Control';

  // DOM elements
  var _guiNodes;

  // Called once to generate the GUI nodes
  var _createGUI = function() {
    // create GUI
    _guiNodes = document.createElement('div');
    _guiNodes.id = 'skitt-ui';
    _guiNodes.innerHTML = '<a id="skitt-toggle-button">&nbsp;</a><label for="skitt-toggle-button" id="skitt-toggle-button__label">'+_toggleLabelText+'</label>';
    document.body.appendChild(_guiNodes);

    _attachStylesheet();

    // Attach events
    document.getElementById('skitt-toggle-button').addEventListener('click', function(){
      _root.SpeechKITT.toggleRecognition();
    });
  };

  // Attach a style sheet if GUI already attached
  var _attachStylesheet = function() {
    if (_stylesheet && _guiNodes) {
      if (_stylesheetNode) {
        _stylesheetNode.href = _stylesheet;
      } else {
        _stylesheetNode = document.createElement('link');
        _stylesheetNode.rel = 'stylesheet';
        _stylesheetNode.href = _stylesheet;
        _stylesheetNode.id = 'skitt-style-sheet';
        document.body.appendChild(_stylesheetNode);
      }
    }
  };

  // Called to change GUI look to listening
  var _setGUIListening = function() {
    if (_guiNodes === undefined) {
      return;
    }
    _guiNodes.classList.remove('skitt-ui--not-listening');
    _guiNodes.classList.add('skitt-ui--listening');
  };

  // Called to change GUI look to not listening
  var _setGUINotListening = function() {
    if (_guiNodes === undefined) {
      return;
    }
    _guiNodes.classList.add('skitt-ui--not-listening');
    _guiNodes.classList.remove('skitt-ui--listening');
  };

  // Called internally to set listening status to on, and update interface if needed
  var _setStatusOn = function() {
    if (!_statusListening) {
      _statusListening = true;
      _setGUIListening();
    }
  };

  // Called internally to set listening status to off, and update interface if needed
  var _setStatusOff = function() {
    if (_statusListening) {
      _statusListening = false;
      _setGUINotListening();
    }
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
      _setStatusOn();
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
      _setStatusOff();
    },

    /**
     * Toggles speech recognition. Make sure to define the speech recognition abort and start commands first
     *
     * @method toggleRecognition
     */
    toggleRecognition: function() {
      if (_statusListening) {
        this.abortRecognition();
      } else {
        this.startRecognition();
      }
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
      _setStatusOn();
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
      _setStatusOff();
    },

    /**
     * Call once done configuring KITT, to render its interface.
     *
     * @method render
     */
    render: function() {
      if (_guiNodes === undefined) {
        _createGUI();
      }
      //set GUI status
      if (this.isListening()) {
        _setGUIListening();
      } else {
        _setGUINotListening();
      }
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
     * Call to show the GUI if it has been hidden with hide()
     * Interface must have been previously rendered with render()
     *
     * @method show
     */
    show: function() {
      if (_guiNodes === undefined) {
        throw new TypeError('cannot show interface. Must be rendered first');
      }
      _guiNodes.classList.remove('skitt-ui--hidden');
    },

    /**
     * Call to hide the GUI
     * Interface must have been previously rendered with render()
     *
     * @method hide
     */
    hide: function() {
      if (_guiNodes === undefined) {
        throw new TypeError('cannot hide interface. Must be rendered first');
      }
      _guiNodes.classList.add('skitt-ui--hidden');
    },

    /**
     * Returns true if Speech Recognition is currently on.
     *
     * This can be wrong KITT wasn't completely configured correctly, or was started
     * while Speech Recognition was already running/
     *
     * @returns {boolean} true = listening or false = not listening
     * @method isListening
     */
    isListening: function() {
      return _statusListening;
    },

    setStylesheet: function(css) {
      _stylesheet = css;
      _attachStylesheet();
    },

    setToggleLabelText: function(labelText) {
      _toggleLabelText = labelText;
      if (_guiNodes) {
        document.getElementById('skitt-toggle-button__label').innerText = _toggleLabelText;
      }
    }

  };

}).call(this);
