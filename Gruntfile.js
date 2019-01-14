module.exports = function(grunt) {

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Project config
  grunt.initConfig({
    // Banner
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      '*/\n',
      //' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>*/ '
      
    
    // Task config
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      test: {
        src: ['test/*.js'],
        dest: 'test/dist/<%= pkg.name %>.js'
      }
    },
    
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      test: {
        src: '<%= concat.test.dest %>',
        dest: 'test/dist/<%= pkg.name %>.min.js'
      }
    },
    
    watch: {
      test: {
        files: '<%= concat.test.src %>',
        tasks: ['default']
      }
    }
  });

  // Load plugins from package.json
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // Register tasks
  grunt.registerTask('default', ['concat:test','uglify:test']);
  grunt.registerTask('dist', ['concat:test','uglify:test']);

};
