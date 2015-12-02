# Speech KITT
> A flexible GUI for interacting with Speech Recognition

[![Build Status](https://travis-ci.org/TalAter/SpeechKITT.svg?branch=master)](https://travis-ci.org/TalAter/SpeechKITT) [![Dependency Status](https://gemnasium.com/TalAter/SpeechKITT.svg)](https://gemnasium.com/TalAter/SpeechKITT)

KITT makes it easy to add a GUI to pages using Speech Recognition. Whether you are using [annyang](https://github.com/TalAter/annyang), a different library or even webkitSpeechRecognition directly, KITT will take care of the GUI.

## Hello World

````html
<script src="speechkitt.min.js"></script>
<script>
// Which command starts Speech Recognition?
SpeechKITT.setStartCommand(webkitSpeechRecognition.start);

// Which command stops Speech Recognition?
SpeechKITT.setAbortCommand(webkitSpeechRecognition.abort);

// Render KITT's interface
SpeechKITT.vroom();
</script>
````

## Speech KITT is currently under heavy construction!
Feel free to **Star** and **Watch** it, but watch out for falling debris, and a wildly changing API.

Feedback and contributions are always welcome and appreciated.

### Author
Tal Ater: [@TalAter](https://twitter.com/TalAter)

### License
Licensed under [MIT](https://github.com/TalAter/SpeechKITT/blob/master/LICENSE).