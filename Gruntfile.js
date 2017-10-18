/*global module:false*/
module.exports = function(grunt) {

  /*
  ===========
  PLUGINS
  ===========
  1. imagemin - compress images
    a. imagemin-mozjpeg - specialized jpg compression plugin for imagemin
  2. responsive images - create multiple size images for responsive use
  3. uglify - minify and concat js
  4. cssmin - minify and concat css
  5. watch - watch files for changes and run relevant tasks

  ============
  TASK TARGETS
  ============
  grunt: (default)
  runs all the basic web dev tasks:
  -responsive image creation for 2  large background imgs
  -imagemin on img folder
  -concat/minify files in js folder
  -concat/minify files in css folder

  */
  // include the imagemin-mozjpeg plugin for imagemin
  var mozjpeg = require('imagemin-mozjpeg'); //plugin for imagemin

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // Task configuration.

    // responsive images plugin - generate multiple sizes of images
    responsive_images: {
      // run plugin subtasks using syntax, name:task ie responsive_images:dev
      dev: {
        options: {
          // see docs for options: https://github.com/andismith/grunt-responsive-images
          sizes: [{
            name : 'large', // will be suffixed to the filename for this size
            width: '100%' // % of the original img size
          }, {
            name : 'medium',
            width: '66%'
          }, {
            name : 'small',
            width: '33%'
          }]
        },
        files: {
          // output dest : input src
          'img/stars.jpg' : 'src/img/stars.jpg', // the intro background img
          'img/space.jpg' : 'src/img/space.jpg' // main game background img
        }
      }
    },

    // imagemin plugin - optimize images w/ lossless compression
    // eke out more savings with lossier methods case by case
    imagemin: {
        // default task
        dynamic: { // target
            options: {
                optimizationLevel: 7, // max optimize pngs
                progressive: true, // progressive jpgs
                interlaced: true, // progressive gifs
                use: [mozjpeg({quality:80})] // use the mozjpeg optimizer plugin for imagemin because it's better for web
            },
            files: [{
                expand: true, // Enable dynamic expansion
                cwd: 'src/img', // Src matches are relative to this path
                src: ['*.{png,jpg,gif}'], // Actual patterns to match, case SENSITIVE
                dest: 'img' // Destination path prefix
            }]
        },
        // custom task: img_folder
        img_folder: { // for optimizing stuff already in the dest img folder
          options: {
              optimizationLevel: 7, // max optimize pngs
              progressive: true, // progressive jpgs
              interlaced: true, // progressive gifs
              use: [mozjpeg({quality:80})] // use the mozjpeg optimizer plugin for imagemin because it's better for web
          },
          files: [{
              expand: true, // Enable dynamic expansion
              cwd: 'img', // Src matches are relative to this path
              src: ['*.{png,jpg,gif}'], // Actual patterns to match, case SENSITIVE
              dest: 'img' // Destination path prefix
          }]
        },
        // for optimizing just favicons
        icons: {
          options: {
              optimizationLevel: 7, // max optimize pngs
              use: [mozjpeg({quality:80})] // use the mozjpeg optimizer plugin for imagemin because it's better for web
          },
          files: {
              // output dest : input src
              'favicon-32x32.png' : 'favicon-32x32.png', // favicon
              'social-cover.jpg' : 'social-cover.jpg' // fb link preview img
          }
        }
    },

    // uglify plugin - minify and concatenate js files
    uglify: {
      dist: {
        options: {
        },
        files: {
          // output : [input(s) in order]
          'js/scripts.min.js' : [
            'js/vendor/modernizr-2.8.3.min.js',
            'js/vendor/jquery-1.12.0.min.js',
            'js/main.js',
            'js/plugins.js'
          ]
        }
      }
    },

    // cssmin plugin - minify and concat css files
    cssmin: {
      options: {
        // merges longhand properties into a single shorthand one, might be dangerous
        shorthandCompacting: false,
      },
      all_css: {
        files: {
          // output : [input(s)]
          'css/style.min.css': [
            'css/normalize.css',
            'css/main.css',
            'css/style.css'
          ]
        }
      }
    },

    // watch plugin - watch specified files for changes then run tasks on change
    watch: {
      js_css: {
        files: [
          'js/**/*.js',
          'css/**/*.css',
          '!js/scripts.min.js', // exclude since uglify task changes this file
          '!css/style.min.css' // exclude since cssmin task changes this file
        ],
        tasks: ['uglify', 'cssmin'],
        options: {
        },
      },
    }

    // htmlmin plugin - minifies html files, useful for large html files
    // docs on each option:
    // http://perfectionkills.com/experimenting-with-html-minifier/#options
    // htmlmin: {
    //   dist: {
    //     options: {
    //       removeComments: true, // removes html comments
    //       collapseWhitespace: true, // remove whitespace
    //       collapseBooleanAttributes: true, // instead of attribute=x, just have x
    //       removeAttributeQuotes: true, // attribute quotes unnecessary in certain cases
    //       removeRedundantAttributes: true, // no need to set default attributes
    //       useShortDoctype: true, // use html5 doctype
    //       removeOptionalTags: true // strip html, head body, thead, tbody, tfoot tags
    //     },
    //     files: {
    //       // 'destination': 'source'
    //       'index.html': 'index.html'
    //     }
    //   }
    // }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['responsive_images', 'imagemin:img_folder', 'uglify', 'cssmin']);

};
