//! Speech KITT
//! version : 0.3.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/SpeechKITT

/**
 * # Getting Started
 *
 * The quickest way to get started is described in the project's [README](https://github.com/TalAter/SpeechKITT/blob/master/README.md).
 *
 * Additional details and methods to interact with KITT are described below.
 *
 * # API Reference
 */

(function (undefined) {
  "use strict";

  // Save a reference to the global object (window in the browser)
  var _root = this;

  // Internal variable pointing to the timeout used to make sure KITT isn't stopped and immediately started (See `onEnd()`)
  var _listeningStoppedTimeout;

  // Set by SpeechKITT.rememberStatus() - Number of minutes after KITT has been activated by user to remember his choice
  var _minutesToRememberStatus = 0;

  // Reference to functions used to start and abort speech recognition
  var _startCommand;
  var _abortCommand;

  // Is speech recognition currently on?
  var _statusListening = false;

  // URL to the stylesheet to use
  var _stylesheet;
  var _stylesheetNode;

  // Texts used in UI
  var _toggleLabelText = 'Activate Voice Control';
  var _listeningInstructionsText = 'What can I help you with?';
  var _sampleCommands = [];

  // DOM elements
  var _guiNodes;

  // Attach a style sheet if GUI already attached, if already attached, update it's href
  var _updateStylesheet = function() {
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

  // Update texts shown while listening
  var _updateListeningText = function() {
    if (_sampleCommands.length && _guiNodes) {
      var samplesNode = document.getElementById('skitt-listening-text__samples');
      if (!samplesNode) {
        var instructionsNode = document.getElementById('skitt-listening-text__instructions');
        samplesNode = document.createElement('span');
        samplesNode.id = 'skitt-listening-text__samples';
        instructionsNode.parentNode.insertBefore(samplesNode, instructionsNode.nextSibling);
      }
      samplesNode.innerText = _sampleCommands.join('. ')+'.';
    }
  };

  // Called once to generate the GUI nodes
  var _createGUI = function() {
    // create GUI
    _guiNodes = document.createElement('div');
    _guiNodes.id = 'skitt-ui';
    _guiNodes.innerHTML = '<a id="skitt-toggle-button">&nbsp;</a><label for="skitt-toggle-button" id="skitt-toggle-button__label">'+_toggleLabelText+'</label><div id="skitt-listening-box"><div id="skitt-listening-text"><span id="skitt-listening-text__instructions">'+_listeningInstructionsText+'</span></div></div>';
    _guiNodes.style.display = 'none';
    document.body.appendChild(_guiNodes);

    _updateListeningText();

    _updateStylesheet();

    // Attach events
    document.getElementById('skitt-toggle-button').addEventListener('click', function(){
      _root.SpeechKITT.toggleRecognition();
    });
  };

  // Checks if GUI was already created
  var _guiCreated = function () {
    return _guiNodes !== undefined;
  };

  // Called to change GUI look to listening
  var _setGUIListening = function() {
    if (!_guiCreated()) {
      return;
    }
    _guiNodes.classList.remove('skitt-ui--not-listening');
    _guiNodes.classList.add('skitt-ui--listening');
  };

  // Called to change GUI look to not listening
  var _setGUINotListening = function() {
    if (!_guiCreated()) {
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

  // Helper function used by various public methods which change texts
  var _setText = function(text, id) {
    if (_guiNodes) {
      document.getElementById(id).innerText = text;
    }
  };

  // Saves a cookie called skittremember which signifies that the user has chosen to turn on Speech Recognition
  var _saveListeningStatusCookie = function() {
    var dtExpiration = new Date();
    dtExpiration.setTime(dtExpiration.getTime() + 60000 * _minutesToRememberStatus);
    document.cookie="skittremember=1; expires="+dtExpiration.toUTCString()+"; path=/";
  };

  // Deletes the skittremember cookie because the user has chosen to stop Speech Recognition
  var _deleteListeningStatusCookie = function() {
    document.cookie="skittremember=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  };

  // Checks for existence of the skittremember cookie which signifies that Speech Recognition should be turned on
  var _listeningStatusCookieExists = function() {
    return document.cookie.indexOf('skittremember') !== -1;
  };

  var _ifNotFunctionThrowError = function(func, errorText) {
    if (typeof func !== 'function') {
      throw new TypeError(errorText);
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
      _ifNotFunctionThrowError(callback, 'invalid callback function');
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
      _ifNotFunctionThrowError(callback, 'invalid callback function');
      context = context || this;

      _abortCommand = {callback: callback, context: context};
    },

    /**
     * Starts the speech recognition. This is equivalent to the user pushing KITT's buttons.
     * Make sure to define the speech recognition command start first using setStartCommand()
     *
     * @method startRecognition
     */
    startRecognition: function() {
      if (!_startCommand) {
        throw new TypeError('cannot start recognition. Start command not defined');
      }
      // If need to remember status, save a cookie now
      if (_minutesToRememberStatus) {
        _saveListeningStatusCookie();
      }
      _startCommand.callback.apply(_startCommand.context);
      _setStatusOn();
    },

    /**
     * Aborts the speech recognition. This is equivalent to the user pushing KITT's buttons.
     * Make sure to define the speech recognition abort command first using setStartCommand()
     *
     * @method abortRecognition
     */
    abortRecognition: function() {
      if (!_abortCommand) {
        throw new TypeError('cannot abort recognition. Abort command not defined');
      }
      // Clear status cookie
      _deleteListeningStatusCookie();
      _abortCommand.callback.apply(_abortCommand.context);
      _setStatusOff();
    },

    /**
     * Toggles speech recognition. This is equivalent to the user pushing KITT's buttons.
     * Make sure to define the speech recognition abort and start commands first
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
      _root.clearTimeout(_listeningStoppedTimeout);
      _setStatusOn();
    },

    /**
     * This function should be called when the browser's SpeechRecognition end event fires.
     * Attach this function to the Speech Recognition instance's end event.
     *
     * KITT's interface will only change to 'stopped' 100ms after this method is called.
     * If Speech Recognition restarts before 100ms have passed, the interface will just remain
     * in 'started' mode (this is to prevent the interface from flickering when Speech
     * Recognition is stopped and immediately restarted programmatically)
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
      _listeningStoppedTimeout = setTimeout(_setStatusOff, 100);
    },

    /**
     * Set the URL to the stylesheet for the UI
     *
     * @param string css relative or absolute url to the stylesheet
     * @method setStylesheet
     */
    setStylesheet: function(css) {
      _stylesheet = css;
      _updateStylesheet();
    },

    /**
     * Call once done configuring KITT, to render its interface.
     *
     * @method render
     */
    render: function() {
      if (!_guiCreated()) {
        _createGUI();
      }
      // If cookie for on status exists, start listening immediately
      if (_listeningStatusCookieExists() && !this.isListening()) {
        this.startRecognition();
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
     * Call to hide the GUI
     * Interface must have been previously rendered with render()
     *
     * @method hide
     */
    hide: function() {
      if (!_guiCreated()) {
        throw new TypeError('cannot hide interface. Must be rendered first');
      }
      _guiNodes.classList.add('skitt-ui--hidden');
    },

    /**
     * Call to show the GUI if it has been hidden with hide()
     * Interface must have been previously rendered with render()
     *
     * @method show
     */
    show: function() {
      if (!_guiCreated()) {
        throw new TypeError('cannot show interface. Must be rendered first');
      }
      _guiNodes.classList.remove('skitt-ui--hidden');
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

    /**
     * Set the text for the toggle button's label.
     * Defaults to: 'Activate Voice Control'
     *
     * @param string text The text to show next to toggle button
     * @method setSampleCommands
     */
    setToggleLabelText: function(text) {
      _toggleLabelText = text;
      _setText(text, 'skitt-toggle-button__label');
    },

    /**
     * Set the instructional text which will be shown next to toggle button when listening.
     * Defaults to: 'What can I help you with?'
     *
     * @param string text The text to show next to toggle button when listening
     * @method setInstructionsText
     */
    setInstructionsText: function(text) {
      _listeningInstructionsText = text;
      _setText(text, 'skitt-listening-text__instructions');
    },

    /**
     * Pass this an array of sample textual commands which your application responds to.
     * These will then be shown to the user to help him understand what commands he can use.
     *
     * @param array commands An array of strings, each a sample command.
     * @method setSampleCommands
     */
    setSampleCommands: function(commands) {
      _sampleCommands = commands;
      _updateListeningText();
    },

    /**
     * Set this and KITT will remember when the user clicks the button to turn on Speech Recognition, and next time
     * they visit the site, Speech Recognition will be turned on again (unless user turned it off, or a certain number
     * of minutes has passed since it was last on).
     *
     * Disabled by default. To disable manually after you enabled, pass 0 to it.
     *
     * Example:
     * ````javascript
     * SpeechKITT.rememberStatus(120);  // Automatically start Speech Recognition for any consecutive
     *                                  // visit to this page in the next 120 minutes, or until the user
     *                                  // has clicked the button to stop listening.
     * ````
     *
     * @param minutes integer Number of minutes to remember choice to turn on Speech Recognition
     */
    rememberStatus: function(minutes) {
      if (typeof minutes !== "number" || minutes < 0) {
        throw new TypeError('rememberStatus() only accepts positive integers');
      }
      _minutesToRememberStatus = minutes;
    },

    /**
     * Call this if you're using annyang to automatically configure Speech KITT to interact with it.
     * Automatically does the following:
     * Set Speech KITT's start command to annyang.start
     * Set Speech KITT's abort command to annyang.abort
     * Adds a callback to annyang's start event to call SpeechKITT.onStart
     * Adds a callback to annyang's end   event to call SpeechKITT.onEnd
     *
     * @method annyang
     */
    annyang: function() {
      this.setStartCommand(annyang.start);
      this.setAbortCommand(annyang.abort);
      annyang.addCallback('start', this.onStart);
      annyang.addCallback('end', this.onEnd);
    }

  };

}).call(this);
