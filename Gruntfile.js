module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'src/speechkitt.js',
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
          'dist/speechkitt.min.js': ['src/speechkitt.js']
        }
      }
    },
    watch: {
      files: ['src/speechkitt.js', 'test/spec/**.js', '!**/node_modules/**'],
      tasks: ['default']
    },
    jasmine: {
      src: {
        src: 'src/*.js',
        options: {
          specs: 'test/spec/*Spec.js',
          outfile: 'test/SpecRunner.html',
          keepRunner: true
        }
      },
      coverage: {
        src: 'src/*.js',
        options: {
          specs: ['test/spec/*Spec.js'],
          outfile: 'test/SpecRunnerCoverage.html',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'test/coverage/coverage.json',
            report: [
              {
                type: 'html',
                options: {
                  dir: 'test/coverage'
                }
              },
              {
                type: 'text'
              }
            ],
            thresholds: {
              lines: 100,
              statements: 100,
              branches: 100,
              functions: 100
            }
          }
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
