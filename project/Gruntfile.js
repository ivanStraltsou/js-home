module.exports = function (grunt) {
	grunt.initConfig({
		 pkg: grunt.file.readJSON('package.json'),
		 
		// js hint 
		 jshint: {
          options: {
            curly: true,
            eqeqeq: false,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            eqnull: true,
            browser: true,
			devel:true,
            globals: {
			  jQuery: true,
              $: true,
			  _:true,
			  Backbone:true,
              app:true
            }
          },
          '<%= pkg.name %>': { 
            src: ['js/app/**/*.js'] 
          }
        },
		// js concat
		concat: { 
            dist: {
                src: [
				'js/libs/underscore.js',
				'js/libs/jquery-1.8.3.js',
				'js/libs/backbone.js',
				'js/libs/backbone/backbone.localStorage.js',
				'js/libs/bootstrap/tooltip.js',
				'js/app/app.js',
				'js/app/models/user.js',
				'js/app/collections/users.js',
				'js/app/views/user.js',
				'js/app/views/users.js',
				'js/app/views/app.js'
				],
                dest: '../build/js/temp/app-concat.js'
            }
        },
		// Remove console
		removelogging: {
            dist: {
              src: "../build/js/temp/app-concat.js",
			  dest: "../build/js/temp/app-concat-remove-log.js"
            }
        },
		// js min
		uglify: {
            build: {
                src: '../build/js/temp/app-concat-remove-log.js',
                dest: '../build/js/app.build.min.js'
            }
        },
		 // css min options
		cssmin:{
			combine:{
				files:{
				'../build/css/app.build.min.css':['css/bootstrap.css','css/bootstrap-theme.css','css/main.css']
				}
			}
		 },
		 // Watch
		 watch:{
			 scripts: {
                files: ['js/app/app.js',
				'js/app/models/user.js',
				'js/app/collections/users.js',
				'js/app/views/user.js',
				'js/app/views/users.js',
				'js/app/views/app.js'],
                tasks: ['jshint','concat','removelogging','uglify']
            },
            css: {
                files: ['css/bootstrap.css','css/bootstrap-theme.css','css/main.css'],
                tasks: ['cssmin']
            }
		 }
		  
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['cssmin','jshint','concat','removelogging','uglify','watch']);
	
};