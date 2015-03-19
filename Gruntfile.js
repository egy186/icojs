module.exports = function (grunt) {
  'use strict';

  grunt.util.linefeed = '\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          targetDir: 'demo/lib',
          layout: 'byComponent',
          install: true,
          verbose: true,
          cleanTargetDir: true,
          cleanBowerDir: false
        }
      }
    },
    update_json: {
      options: {
        src: 'package.json',
        indent: '  '
      },
      bower: {
        src: 'bower.json',
        dest: 'package.json',
        fields: [
          'version',
          'description'
        ]
      },
    },
    concat: {
      options: {
        banner: '/*!\n' +
                ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                ' *  <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright <%= grunt.template.today("yyyy") %> (c) <%= pkg.author %>\n' +
                ' * Released under <%= pkg.license %> License.\n' +
                ' */\n\n'
      },
      dist: {
        src: ['src/intro.js', 'src/ico.js', 'src/outro.js'],
        dest: 'dist/ico.js'
      }
    },
    uglify: {
      all: {
        files: {
          'dist/ico.min.js': ['<%= concat.dist.dest %>']
        },
        options: {
          preserveComments: false,
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>; <%= pkg.license %> license */',
          sourceMap: true,
          beautify: {
            ascii_only: true
          },
          compress: {
            hoist_funs: false,
            loops: false,
            unused: false
          },
          report: 'min'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['bower', 'update_json', 'build']);
};
