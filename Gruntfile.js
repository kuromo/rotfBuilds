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
      extJS: {
        src: ['assets/ext/*.js'],
        dest: 'public/javascripts/ext.js'
      },
      extCSS: {
        src: ['assets/ext/*.css'],
        dest: 'public/stylesheets/ext.css'
      },
      data: {
        src: ['assets/data/*.json'],
        dest: 'public/data/data.json'
      },
      js: {
        src: ['assets/javascripts/*.js'],
        dest: 'public/javascripts/main.js'
      },
      css: {
        src: ['assets/stylesheets/*.css'],
        dest: 'public/stylesheets/style.css'
      }
    },
    
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      js: {
        src: '<%= concat.js.dest %>',
        dest: 'public/javascripts/main.min.js'
      },
      css: {
        src: '<%= concat.css.dest %>',
        dest: 'public/stylesheets/style.min.css'
      }
    },

    cssmin: {
      css: {
        src: '<%= concat.css.dest %>',
        dest: 'public/stylesheets/style.min.css'
      }
    },

    copy: {
      ext: {
        files: [{
          cwd: 'node_modules/',
          src: [
            'bootstrap/dist/js/bootstrap.js', 
            'bootstrap/dist/css/bootstrap.css', 
            'skrollr/dist/skrollr.min.js'
          ],
          dest: 'assets/ext',
          flatten: true,
          expand: true
        }]
      },
      fonts: {
        files: [{
          cwd: 'node_modules/bootstrap/dist/fonts',
          src: '*.*',
          dest: 'public/fonts',
          expand: true
        }]
      }
    },
    
    watch: {
      dev: {
        files: 'assets/*/*.*',
        tasks: ['default']
      }
    }
  });

  // Load plugins from package.json
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // Register tasks
  grunt.registerTask('default', ['js','css','data']);
  grunt.registerTask('dist', []);
  grunt.registerTask('js', ['concat:js','uglify:js']);
  grunt.registerTask('css', ['concat:css','cssmin:css']);
  grunt.registerTask('data', ['concat:data']);
  grunt.registerTask('fonts', ['copy:fonts']);
  grunt.registerTask('ext', ['copy:ext','concat:extJS','concat:extCSS']);
  

};
