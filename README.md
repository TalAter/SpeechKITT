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
SpeechKITT.vroom(); // SpeechKITT.render() does the same thing, but isn't as much fun!
</script>
````

## Hello World - With annyang

If you're doing [Speech Recognition with annyang](https://www.talater.com/annyang/), you can skip most of the configuration above.

````html
<script src="//cdnjs.cloudflare.com/ajax/libs/annyang/2.0.0/annyang.min.js"></script>
<script src="speechkitt.min.js"></script>
<script>
if (annyang) {
  // Add our commands to annyang
  annyang.addCommands({
    'hello': function() { alert('Hello world!'); }
  });

  // Tell KITT to use annyang
  SpeechKITT.annyang();

  // Define a stylesheet for KITT to use
  SpeechKITT.setStylesheet('/themes/flat.css');

  // Render KITT's interface
  SpeechKITT.vroom();
}
</script>
````

### Author
Tal Ater: [@TalAter](https://twitter.com/TalAter)

### License
Licensed under [MIT](https://github.com/TalAter/SpeechKITT/blob/master/LICENSE).
