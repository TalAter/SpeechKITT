module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'src/speech-ui-kitt.js',
        'Gruntfile.js',
        'test/spec/*Spec.js'
      ],
      options: {
        jshintrc: true
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      all: {
        files: {
          'dist/speech-ui-kitt.min.js': ['src/speech-ui-kitt.js']
        }
      }
    },
    watch: {
      files: ['src/speech-ui-kitt.js', 'test/spec/**.js', '!**/node_modules/**'],
      tasks: ['default']
    },
    jasmine: {
      dist: {
        src: 'src/*.js',
        options: {
          specs: 'test/spec/*Spec.js',
          outfile: 'test/SpecRunner.html',
          keepRunner: true
        }
      }
    }
  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'jasmine']);

  // Test task
  grunt.registerTask('test', ['jshint', 'jasmine']);

};
