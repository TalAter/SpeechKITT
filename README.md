# Speech KITT
<img src="https://raw.githubusercontent.com/TalAter/SpeechKITT/master/demo/README-logo.png" align="right" />
> A flexible GUI for interacting with Speech Recognition

[![Build Status](https://travis-ci.org/TalAter/SpeechKITT.svg?branch=master)](https://travis-ci.org/TalAter/SpeechKITT) [![Dependency Status](https://gemnasium.com/TalAter/SpeechKITT.svg)](https://gemnasium.com/TalAter/SpeechKITT)

KITT makes it easy to add a GUI to pages using Speech Recognition. Whether you are using [annyang](https://github.com/TalAter/annyang), a different library or even webkitSpeechRecognition directly, KITT will take care of the GUI.

## Hello World

````html
<script src="speechkitt.min.js"></script>
<script>
// Init the browser's own Speech Recognition
var recognition = new webkitSpeechRecognition();

// Tell KITT the command to use to start listening
SpeechKITT.setStartCommand(function() {recognition.start()});

// Tell KITT the command to use to abort listening
SpeechKITT.setAbortCommand(function() {recognition.abort()});

// Register KITT's recognition start event with the browser's Speech Recognition
recognition.addEventListener('start', SpeechKITT.onStart);

// Register KITT's recognition end event with the browser's Speech Recognition
recognition.addEventListener('end', SpeechKITT.onEnd);

// Define a stylesheet for KITT to use
SpeechKITT.setStylesheet('/themes/flat.css');

// Render KITT's interface
SpeechKITT.vroom(); // SpeechKITT.render() does the same, but isn't as fun!
</script>
````

## Speech KITT is currently under heavy construction!
Feel free to **Star** and **Watch** it, but watch out for falling debris, and a wildly changing API.

Feedback and contributions are always welcome and appreciated.

### Author
Tal Ater: [@TalAter](https://twitter.com/TalAter)

### License
Licensed under [MIT](https://github.com/TalAter/SpeechKITT/blob/master/LICENSE).
