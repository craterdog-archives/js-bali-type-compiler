'use strict';

const path = require('path');
const childProcess = require('child_process');

// wrapper function for grunt configuration
module.exports = function(grunt) {

  grunt.initConfig({

    // read in the package information
    pkg: grunt.file.readJSON('package.json'),

    // grunt-antlr4 plugin configuration (generate parser)
    antlr4: {
      generate: {
        grammar: 'src/grammar/Document.g4',
        options: {
          grammarLevel: {
            language: 'JavaScript'
          },
          flags: [
            'Werror',
            'Xlog',
            'listener',
            'visitor'
          ]
        }
      }
    },

    // grunt-eslint plugin configuration (lint for JS)
    eslint: {
      options: {
      },
      target: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    // grunt-contrib-clean plugin configuration (clean up files)
    clean: {
      generate: [
        '*.log',
        'src/grammar/DocumentLexer.js',
        'src/grammar/DocumentParser.js',
        'src/grammar/DocumentListener.js',
        'src/grammar/DocumentVisitor.js',
        'src/grammar/*.interp',
        'src/grammar/*.tokens'
      ],
      build: [
        'dist/*'
      ],
      options: {
        force: true
      }
    },

    // grunt-mocha-test plugin configuration (unit testing)
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 20000
        },
        src: [
          'test/**/*.js'
        ]
      }
    },

    // grunt-webpack plugin configuration (concatenates and removes whitespace)
    webpack: {
      clientConfig: {
        target: 'web',
        mode: 'development',
        node: {
          fs: "empty"  // required work-around for webpack bug
        },
        entry: './index.js',
        output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'lib-web.js',
          library: 'vm'
        }
      },
      serverConfig: {
        target: 'node',
        mode: 'development',
        entry: './index.js',
        output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'lib-node.js',
          library: 'vm'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('generate', 'Generate the parser code.', ['clean:generate', 'antlr4']);
  grunt.registerTask('build', 'Build the module.', ['clean:build', 'eslint', 'mochaTest']);
  grunt.registerTask('package', 'Package the libraries.', ['clean:build', 'eslint', 'webpack']);
  grunt.registerTask('default', 'Default targets.', ['generate', 'build']);

  grunt.registerMultiTask('antlr4', 'Task for antlr4 parser/lexer generation in JS', function () {
    var commandLine = ['-jar', 'lib/antlr-4.7.1-complete.jar'];
    var options = this.options();
    if (options.flags) options.flags.forEach(function (flag) {
      commandLine.push('-' + flag);
    });
    delete options.flags;
    if (options.grammarLevel) Object.keys(options.grammarLevel).forEach(function (optionKey) {
      commandLine.push('-D' + optionKey + '=' + options.grammarLevel[optionKey]);
    });
    delete options.grammarLevel;
    Object.keys(options).forEach(function (optionKey) {
      commandLine.push('-' + optionKey);
      commandLine.push(options[optionKey]);
    });
    commandLine.push(this.data.grammar);
    childProcess.spawnSync('java', commandLine, {stdio: 'inherit'});
  });

};
