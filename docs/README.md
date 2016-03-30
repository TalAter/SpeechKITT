

<!-- Start src/speechkitt.js -->

# Getting Started

The quickest way to get started is described in the project's [README](https://github.com/TalAter/SpeechKITT/blob/master/README.md).

Additional details and methods to interact with KITT are described below.

# API Reference

## setStartCommand(callback, [context])

Define the function that should be called in order to start speech recognition.

#### Examples:
````javascript
// Will call annyang's start method
SpeechKITT.setStartCommand(annyang.start);
// Will call a global function called listen with a local context.
SpeechKITT.setStartCommand(listen, this);
// Functions can also be stated by name (string)
SpeechKITT.setStartCommand('listen', this);
// Using the browser's native start function
SpeechKITT.setStartCommand(webkitSpeechRecognition.start);
````

### Params:

* **Function|String** *callback* - The function to call to start speech recognition
* **Object** *[context]* - Optional context for the callback function

## setAbortCommand(callback, [context])

Define the function that should be called in order to abort (stop) speech recognition.

#### Examples:
````javascript
// Will call annyang's abort method
SpeechKITT.setAbortCommand(annyang.abort);
// Using the browser's native abort function
SpeechKITT.setAbortCommand(webkitSpeechRecognition.abort);
````

### Params:

* **Function|String** *callback* - The function to call to abort speech recognition
* **Object** *[context]* - Optional context for the callback function

## startRecognition()

Starts the speech recognition. This is equivalent to the user pushing KITT's buttons.

Make sure to define the speech recognition start command first using setStartCommand()

## abortRecognition()

Aborts the speech recognition. This is equivalent to the user pushing KITT's buttons.

Make sure to define the speech recognition abort command first using setAbortCommand()

## toggleRecognition()

Toggles speech recognition. This is equivalent to the user pushing KITT's buttons.

Make sure to define the speech recognition abort and start commands first

## onStart()

This function should be called when the browser's SpeechRecognition start event fires.

Attach this function to the Speech Recognition instance's start event.

#### Examples:
````javascript
var recognition = new webkitSpeechRecognition();
recognition.addEventListener('start', SpeechKITT.onStart);
````

## onEnd()

This function should be called when the browser's SpeechRecognition end event fires.

Attach this function to the Speech Recognition instance's end event.

*Note: KITT's interface will only change to 'stopped' 100ms after this method is called.*
*If Speech Recognition restarts before 100ms have passed, the interface will just remain*
*in 'started' mode (this is to prevent the interface from flickering when Speech*
*Recognition is stopped and immediately restarted programmatically)*

#### Examples:
````javascript
var recognition = new webkitSpeechRecognition();
recognition.addEventListener('end', SpeechKITT.onEnd);
````

## setStylesheet(string)

Set the URL for the stylesheet for the UI

If a stylesheet was previously set, calling this again will update the
interface with a new stylesheet (if the interface was already rendered,
it will be updated)

### Params:

* *string* css relative or absolute url to the stylesheet

## render()

Call after configuring KITT, to render its interface.

## vroom()

Call after configuring KITT, to render its interface.

Identical to calling SpeechKITT.render();

See: [render()](#render)

## hide()

Call to hide the GUI.

Interface must have been previously rendered with render()

## show()

Call to show the GUI if it has been hidden with hide()

Interface must have been previously rendered with render()

## isListening()

Returns true if Speech Recognition is currently on.

This can be wrong if KITT wasn't completely configured correctly, or was
started while Speech Recognition was already running.

### Return:

* **boolean** true = listening or false = not listening

## setToggleLabelText(string)

Set the text for the toggle button's label.

Defaults to: 'Activate Voice Control'

### Params:

* *string* text The text to show next to toggle button

## setInstructionsText(string)

Set the instructional text which will be shown next to toggle button when listening.

Accepts simple text or HTML.

Defaults to: 'What can I help you with?'

### Params:

* *string* text The text to show next to toggle button when listening

## setSampleCommands(array)

Pass this an array of sample textual commands which your application responds to.

These will then be shown to the user to help him understand what commands he can use.

### Params:

* *array* commands An array of strings, each a sample command.

## rememberStatus(minutes)

Set this and KITT will remember when the user clicks the button to turn on Speech Recognition, and next time
they visit the site, Speech Recognition will be turned on again (unless user turned it off, or a certain number
of minutes has passed since it was last on).

Disabled by default. Enable by passing an integer which is the number of minutes to remember.
To disable manually after you enabled, pass 0 to it.

Example:
````javascript
SpeechKITT.rememberStatus(120);  // Automatically start Speech Recognition for any consecutive
                                 // visit to this page in the next 120 minutes, or until the user
                                 // has clicked the button to stop listening.
````

### Params:

* *minutes* integer Number of minutes to remember choice to turn on Speech Recognition

## getLastRecognizedSentence()

Returns the last sentenced recognized by speech recognition.

*Note: You need to set sentences as they are recognized with setRecognizedSentence().*
*If you are using annyang, this happens automatically.*

See: [setRecognizedSentence()](#setrecognizedsentencesentence)

### Return:

* undefined|string

## setRecognizedSentence(sentence)

Add a sentence that was recognized.
You will usually want to call this from the SpeechRecognition's result event.

Example:
````javascript
var recognition = new webkitSpeechRecognition();
recognition.addEventListener('result', function(ev) {
  SpeechKITT.setRecognizedSentence(
    ev.results[ev.resultIndex][0].transcript // This is where the browser hides the text the user said
  );
});
````

*Note: If you're using annyang, this gets called automatically for you.*

See: [annyang()](#annyang)

### Params:

* *sentence* string

## displayRecognizedSentence([newState=true])

Speech KITT can display the last sentence the user said in the GUI.
Set this to true to display the last sentence. Set it to false to remove it from the DOM.

For more details on how to track the sentences said, see the documentation for setRecognizedSentence()

See: [setRecognizedSentence()](#setrecognizedsentencesentence)

### Params:

* **boolean** *[newState=true]* - Turn on/off display of recognized sentences

## annyang()

Call this if you're using annyang to automatically configure Speech KITT to interact with it.

Automatically does the following:
- Set Speech KITT's start command to annyang.start
- Set Speech KITT's abort command to annyang.abort
- Adds a callback to annyang's start event to call SpeechKITT.onStart
- Adds a callback to annyang's end   event to call SpeechKITT.onEnd

<!-- End src/speechkitt.js -->

