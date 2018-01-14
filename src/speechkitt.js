//! Speech KITT
//! version : 1.0.0
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
  'use strict';

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

  // A list of sentences recognized
  var _recognizedSentences = [];

  // Should sentences recognized be rendered to DOM?
  var _displayRecognizedSentence = false;

  // DOM elements
  var _guiNodes;

  // Checks if GUI was already created
  var _guiCreated = function () {
    return _guiNodes !== undefined;
  };

  // Attach a style sheet if GUI already attached, if already attached, update it's href
  var _updateStylesheet = function() {
    if (_stylesheet && _guiCreated()) {
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
    if (!_guiCreated()) {
      return;
    }
    var samplesNode = document.getElementById('skitt-listening-text__samples');
    if (_sampleCommands.length) {
      if (!samplesNode) {
        var nodeToInsertAfter = document.getElementById('skitt-listening-text__instructions');
        samplesNode = document.createElement('span');
        samplesNode.id = 'skitt-listening-text__samples';
        nodeToInsertAfter.parentNode.insertBefore(samplesNode, nodeToInsertAfter.nextSibling);
      }
      samplesNode.innerText = _sampleCommands.join('. ')+'.';
      _guiNodes.classList.add('skitt-ui--sample-commands-shown');
    } else {
      if (samplesNode) {
        samplesNode.parentNode.removeChild(samplesNode);
      }
      _guiNodes.classList.remove('skitt-ui--sample-commands-shown');
    }
  };

  var _updateRecognizedSentenceText = function() {
    if (!_guiCreated()) {
      return;
    }
    var recognizedSentenceNode = document.getElementById('skitt-listening-text__recognized-sentence');
    var lastRecognizedSentenceText = _root.SpeechKITT.getLastRecognizedSentence();
    if (lastRecognizedSentenceText && _displayRecognizedSentence) {
      if (!recognizedSentenceNode) {
        var nodeToInsertAfter = document.getElementById('skitt-listening-text__samples') || document.getElementById('skitt-listening-text__instructions');
        recognizedSentenceNode = document.createElement('span');
        recognizedSentenceNode.id = 'skitt-listening-text__recognized-sentence';
        nodeToInsertAfter.parentNode.insertBefore(recognizedSentenceNode, nodeToInsertAfter.nextSibling);
      }
      recognizedSentenceNode.innerText = lastRecognizedSentenceText;
      _guiNodes.classList.add('skitt-ui--recognized-sentence-shown');
    } else {
      if (recognizedSentenceNode) {
        recognizedSentenceNode.parentNode.removeChild(recognizedSentenceNode);
      }
      _guiNodes.classList.remove('skitt-ui--recognized-sentence-shown');
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
    if (_guiCreated()) {
      document.getElementById(id).innerHTML = text;
    }
  };

  var _annyangSetRecognizedSentence = function(sentences) {
    if (Array.isArray(sentences)) {
      sentences = sentences[0];
    }
    _root.SpeechKITT.setRecognizedSentence(sentences);
  };

  // Saves a cookie called skittremember which signifies that the user has chosen to turn on Speech Recognition
  var _saveListeningStatusCookie = function() {
    var dtExpiration = new Date();
    dtExpiration.setTime(dtExpiration.getTime() + 60000 * _minutesToRememberStatus);
    document.cookie='skittremember=1; expires='+dtExpiration.toUTCString()+'; path=/';
  };

  // Deletes the skittremember cookie because the user has chosen to stop Speech Recognition
  var _deleteListeningStatusCookie = function() {
    document.cookie='skittremember=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
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
     *
     * Make sure to define the speech recognition start command first using setStartCommand()
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
     *
     * Make sure to define the speech recognition abort command first using setAbortCommand()
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
     *
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
     *
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
     *
     * Attach this function to the Speech Recognition instance's end event.
     *
     * *Note: KITT's interface will only change to 'stopped' 100ms after this method is called.*
     * *If Speech Recognition restarts before 100ms have passed, the interface will just remain*
     * *in 'started' mode (this is to prevent the interface from flickering when Speech*
     * *Recognition is stopped and immediately restarted programmatically)*
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
     * Set the URL for the stylesheet for the UI
     *
     * If a stylesheet was previously set, calling this again will update the
     * interface with a new stylesheet (if the interface was already rendered,
     * it will be updated)
     *
     * @param string css relative or absolute url to the stylesheet
     * @method setStylesheet
     */
    setStylesheet: function(css) {
      _stylesheet = css;
      _updateStylesheet();
    },

    /**
     * Call after configuring KITT, to render its interface.
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
     * Call after configuring KITT, to render its interface.
     *
     * Identical to calling SpeechKITT.render();
     *
     * @method vroom
     * @see [render()](#render)
     */
    vroom: function() {
      this.render();
    },

    /**
     * Call to hide the GUI.
     *
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
     *
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
     * This can be wrong if KITT wasn't completely configured correctly, or was
     * started while Speech Recognition was already running.
     *
     * @returns {boolean} true = listening or false = not listening
     * @method isListening
     */
    isListening: function() {
      return _statusListening;
    },

    /**
     * Set the text for the toggle button's label.
     *
     * Defaults to: 'Activate Voice Control'
     *
     * @param string text The text to show next to toggle button
     * @method setToggleLabelText
     */
    setToggleLabelText: function(text) {
      _toggleLabelText = text;
      _setText(text, 'skitt-toggle-button__label');
    },

    /**
     * Set the instructional text which will be shown next to toggle button when listening.
     *
     * Accepts simple text or HTML.
     *
     * Defaults to: 'What can I help you with?'
     *
     * @param string text The text to show next to toggle button when listening
     * @method setInstructionsText
     */
    setInstructionsText: function(text) {
      if (typeof text === 'string') {
        _listeningInstructionsText = text;
        _setText(text, 'skitt-listening-text__instructions');
      }
    },

    /**
     * Pass this an array of sample textual commands which your application responds to.
     *
     * These will then be shown to the user to help him understand what commands he can use.
     *
     * @param array commands An array of strings, each a sample command.
     * @method setSampleCommands
     */
    setSampleCommands: function(commands) {
      if (!Array.isArray(commands)) {
        commands = [];
      }
      _sampleCommands = commands;
      _updateListeningText();
    },

    /**
     * Set this and KITT will remember when the user clicks the button to turn on Speech Recognition, and next time
     * they visit the site, Speech Recognition will be turned on again (unless user turned it off, or a certain number
     * of minutes has passed since it was last on).
     *
     * Disabled by default. Enable by passing an integer which is the number of minutes to remember.
     * To disable manually after you enabled, pass 0 to it.
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
      if (typeof minutes !== 'number' || minutes < 0) {
        throw new TypeError('rememberStatus() only accepts positive integers');
      }
      _minutesToRememberStatus = minutes;
    },

    /**
     * Returns the last sentenced recognized by speech recognition.
     *
     * *Note: You need to set sentences as they are recognized with setRecognizedSentence().*
     * *If you are using annyang, this happens automatically.*
     *
     * @returns undefined|string
     * @see [setRecognizedSentence()](#setrecognizedsentencesentence)
     */
    getLastRecognizedSentence: function() {
      if (_recognizedSentences.length === 0) {
        return undefined;
      } else {
        return _recognizedSentences[_recognizedSentences.length-1];
      }
    },

    /**
     * Add a sentence that was recognized.
     * You will usually want to call this from the SpeechRecognition's result event.
     *
     * Example:
     * ````javascript
     * var recognition = new webkitSpeechRecognition();
     * recognition.addEventListener('result', function(ev) {
     *   SpeechKITT.setRecognizedSentence(
     *     ev.results[ev.resultIndex][0].transcript // This is where the browser hides the text the user said
     *   );
     * });
     * ````
     *
     * *Note: If you're using annyang, this gets called automatically for you.*
     *
     * @param sentence string
     * @method setRecognizedSentence
     * @see [annyang()](#annyang)
     */
    setRecognizedSentence : function(sentence) {
      if (typeof sentence === 'string') {
        _recognizedSentences.push(sentence);
        _updateRecognizedSentenceText();
      }
    },

    /**
     * Speech KITT can display the last sentence the user said in the GUI.
     * Set this to true to display the last sentence. Set it to false to remove it from the DOM.
     *
     * For more details on how to track the sentences said, see the documentation for setRecognizedSentence()
     *
     * @param {boolean} [newState=true] - Turn on/off display of recognized sentences
     * @method displayRecognizedSentence
     * @see [setRecognizedSentence()](#setrecognizedsentencesentence)
     */
    displayRecognizedSentence: function(newState) {
      if (arguments.length > 0) {
        _displayRecognizedSentence = !!newState;
      } else {
        _displayRecognizedSentence = true;
      }
      _updateRecognizedSentenceText();
    },

    /**
     * Call this if you're using annyang to automatically configure Speech KITT to interact with it.
     *
     * Automatically does the following:
     * - Set Speech KITT's start command to annyang.start
     * - Set Speech KITT's abort command to annyang.abort
     * - Adds a callback to annyang's start event to call SpeechKITT.onStart
     * - Adds a callback to annyang's end   event to call SpeechKITT.onEnd
     *
     * @method annyang
     */
    annyang: function() {
      this.setStartCommand(annyang.start);
      this.setAbortCommand(annyang.abort);
      annyang.addCallback('start', this.onStart);
      annyang.addCallback('end', this.onEnd);
      annyang.addCallback('resultMatch', _annyangSetRecognizedSentence);
      annyang.addCallback('resultNoMatch', _annyangSetRecognizedSentence);
    }

  };

}).call(this);
