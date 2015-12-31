module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'src/speechkitt.js',
        'Gruntfile.js',
        'test/corti.js',
        'test/spec/*Spec.js'
      ],
      options: {
        jshintrc: true
      }
    },
    uglify: {
      dist: {
        options: {
          preserveComments: /^\! /
        },
        files: {
          'dist/speechkitt.min.js': ['src/speechkitt.js']
        }
      }
    },
    watch: {
      files: ['src/speechkitt.js', 'test/corti.js', 'test/spec/**.js', 'themes/**/*', '!**/node_modules/**'],
      tasks: ['default']
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/themes/flat.css': 'themes/flat/flat.scss',
          'dist/themes/flat-amethyst.css': 'themes/flat-amethyst/flat-amethyst.scss',
          'dist/themes/flat-clouds.css': 'themes/flat-clouds/flat-clouds.scss',
          'dist/themes/flat-concrete.css': 'themes/flat-concrete/flat-concrete.scss',
          'dist/themes/flat-emerald.css': 'themes/flat-emerald/flat-emerald.scss',
          'dist/themes/flat-midnight-blue.css': 'themes/flat-midnight-blue/flat-midnight-blue.scss',
          'dist/themes/flat-orange.css': 'themes/flat-orange/flat-orange.scss',
          'dist/themes/flat-pomegranate.css': 'themes/flat-pomegranate/flat-pomegranate.scss',
          'dist/themes/flat-pumpkin.css': 'themes/flat-pumpkin/flat-pumpkin.scss',
          'dist/themes/flat-turquoise.css': 'themes/flat-turquoise/flat-turquoise.scss',
          'dist/themes/basic.css': 'themes/basic.scss'
        }
      }
    },
    markdox: {
      target: {
        files: [
          {src: 'src/speechkitt.js', dest: 'docs/README.md'}
        ]
      }
    },
    jasmine: {
      testAndCoverage: {
        src: ['src/speechkitt.js'],
        options: {
          specs: ['test/spec/*Spec.js'],
          outfile: 'test/SpecRunner.html',
          polyfills: ['test/vendor/corti.js', 'test/init_corti.js', 'test/vendor/annyang.min.js'],
          vendor: ['test/vendor/jquery-2.1.4.min.js', 'test/vendor/jasmine-jquery.js'],
          styles: ['dist/themes/basic.css'],
          keepRunner: true,
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
              lines: 50,
              statements: 50,
              branches: 50,
              functions: 50
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
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-markdox');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'jasmine', 'markdox']);

  // Test task
  grunt.registerTask('test', ['jshint', 'jasmine']);

};
