'use strict';

var childProcess = require('child_process');

// wrapper function for grunt configuration
module.exports = function(grunt) {

  grunt.initConfig({

    // read in the package information
    pkg: grunt.file.readJSON('package.json'),

    // grunt-contrib-jshint plugin configuration (lint for JS)
    jshint: {
      files: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ],
      options: {
        node: true
      }
    },

    // grunt-contrib-clean plugin configuration (clean up files)
    clean: {
      generate: [
        '*.log',
        'src/grammar/InstructionSetLexer.js',
        'src/grammar/InstructionSetParser.js',
        'src/grammar/InstructionSetListener.js',
        'src/grammar/InstructionSetVisitor.js',
        'src/grammar/*.interp',
        'src/grammar/*.tokens'
      ],
      build: [
        'dist/*',
        'test/config/repository/types/*',
        '!test/config/repository/types/#DB8M3B8N81H22ZBY6GZGLBN58SWAGQ6Zv1.bdoc',
        'test/config/repository/documents/*',
        'test/config/repository/drafts/*',
        'test/config/repository/queues/*'
      ],
      options: {
        force: false
      }
    },

    // grunt-antlr4 plugin configuration (generate parser)
    antlr4: {
      generate: {
        grammar: 'src/grammar/InstructionSet.g4',
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

    // grunt-mocha-test plugin configuration (unit testing)
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 10000 
        },
        src: [
          'test/TestBytecode.js',
          'test/TestAssembler.js',
          'test/TestCompiler.js',
          'test/TestTransformers.js',
          'test/TestProcessor.js',
          'test/TestIndex.js',
        ]
      }
    },

    // grunt-contrib-concat plugin configuration (file concatenation)
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        // concatenate the source files and place the result in destination
        src: [
          'src/**/*.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    // grunt-contrib-uglify plugin configuration (removes whitespace)
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('generate', 'Generate the parser code.', ['clean:generate', 'antlr4']);
  grunt.registerTask('build', 'Build the library.', ['clean:build', 'jshint', 'mochaTest', 'concat', 'uglify']);
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
