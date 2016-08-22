module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			file: 'main',
			banner: '/*\n' +
			' * <%= pkg.name %> - <%= pkg.description %>\n' +
			' * version <%= pkg.version %> created at <%= grunt.template.today("yyyy/m/d H:MM:ss") %>\n' +
			' * <%= pkg.homepage %>\n' +
			' * Copyright (c) 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
			' */\n'
		},

		resources: {
			html: "*.html",
			css: "*.css"
		},

		clean: {
			options: {force: true},
			build: ["build/*"]
		},

		concat: {
			package: {
				files: {
					"build/vee.debug.js": [
						"src/vee.js",
						"src/promise.js",
						"src/require.js",
						"src/env.js",
						"src/url.js",
						"src/data.js",
						"src/event.js",
						"src/dom.js",
						"src/gesture.js",
						"src/ajax.js",
						"src/animation.js"
					],
					"build/vee-ui.debug.js": [
						"ui/src/Spinner.js",
						"ui/src/animation.js"
					]
				}
			}
		},

		uglify: {
			options: {
				compress: {
					global_defs: {DEBUG: false, COMPATIBLE: false},
					dead_code: true
				},
				mangle: true,
				preserveComments: false,
				sourceMap: true,
				sourceMapIncludeSources: true,
				report: "min",
				banner: "<%= meta.banner %>"
			},
			build: {
				expand: true,
				src: 'build/*.js',
				rename: function (dest, src) {
					return src.replace('.debug', '');
				}
			}
		},

		compress: {
			options: {
				mode: "gzip",
				level: 9,
				pretty: true
			},
			build: {
				src: 'build/**/*.{js,css,html}',
				rename: function (dest, src) {
					return src + '.gz';
				},
				expand: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-concat");

	grunt.registerTask("default", [
		"clean:build",
		"concat:package",
		"uglify:build",
		"compress:build"
	]);
};
