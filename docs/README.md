

<!-- Start src/speechkitt.js -->

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

Starts the speech recognition. Make sure to define the speech recognition command start first using setStartCommand()

## abortRecognition()

Aborts the speech recognition. Make sure to define the speech recognition abort command first using setStartCommand()

## toggleRecognition()

Toggles speech recognition. Make sure to define the speech recognition abort and start commands first

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

#### Examples:
````javascript
var recognition = new webkitSpeechRecognition();
recognition.addEventListener('end', SpeechKITT.onEnd);
````

## render()

Call once done configuring KITT, to render its interface.

## vroom()

Call once done configuring KITT, to render its interface.
Identical to calling SpeechKITT.render();

See: [render()](#render)

## show()

Call to show the GUI if it has been hidden with hide()
Interface must have been previously rendered with render()

## hide()

Call to hide the GUI
Interface must have been previously rendered with render()

## isListening()

Returns true if Speech Recognition is currently on.

This can be wrong KITT wasn't completely configured correctly, or was started
while Speech Recognition was already running/

### Return:

* **boolean** true = listening or false = not listening

## setStylesheet(string)

Set the URL to the stylesheet for the UI

### Params:

* *string* css relative or absolute url to the stylesheet

## setSampleCommands(array)

Pass this an array of sample textual commands which your application responds to.
These will then be shown to the user to help him understand what commands he can use.

### Params:

* *array* commands An array of strings, each a sample command.

## setSampleCommands(string)

Set the text for the toggle button's label.
Defaults to: 'Activate Voice Control'

### Params:

* *string* text The text to show next to toggle button

## setInstructionsText(string)

Set the instructional text which will be shown next to toggle button when listening.
Defaults to: 'What can I help you with?'

### Params:

* *string* text The text to show next to toggle button when listening

<!-- End src/speechkitt.js -->

