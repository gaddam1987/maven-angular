module.exports = function (grunt) {
    'use strict';
    var LIVERELOAD_PORT = 35729;
    var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
    var mountFolder = function (connect, dir) {
        if (dir === '<%= config.app %>/main') {
            console.log(require('path').resolve(dir));
        }
        return connect.static(require('path').resolve(dir));
    };
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var config = {
        app: 'src',
        dist: 'target'
    };

    grunt.initConfig({
        config: config,
        watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= config.dest%>/main/resources/templates/**/*.html',
                    '<%= config.app%>/main/index.html',
                    '{.tmp,<%= config.app %>}/main/resources/styles/**/*.css',
                    '{.tmp,<%= config.app %>}/main/js/**/*.js',
                    '!{.tmp,<%= config.app %>}/main/js/lib/**/*.js',
                    '<%= config.app %>/images/main/resources/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'src/main')
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, '<%= config.app %>/test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, config.dist)
                        ];
                    }
                }
            },
            open: {
                server: {
                    url: 'http://localhost:<%= connect.options.port %>'
                }
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= config.dist %>'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/main/js/**/*.js',
                '!<%= config.app %>/main/js/lib/**/*.js'
            ]
        },
        useminPrepare: {
            html: '<%= config.app %>/main/index.html',
            options: {
                dest: '<%= config.dist %>'
            }
        },
        usemin: {
            html: ['<%= config.dist %>/templates/**/.html', '<%= config.dist %>/*.html'],
            css: ['<%= config.dist %>/styles/**/*.css'],
            options: {
                dirs: ['<%= config.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/main/resources/images',
                        src: '**/*.{png,jpg,jpeg}',
                        dest: '<%= config.dist %>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/main/',
                        src: ['resources/templates/**/*.html'],
                        dest: '<%= config.dist %>'
                    },
                    {   expand: true,
                        cwd: '<%= config.app %>/main/',
                        src: ['index.html'],
                        dest: '<%= config.dist %>'

                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>/main',
                        dest: '<%= config.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            'js/lib/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= config.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }
                ]
            }
        },
        concurrent: {
            dist: [
                'imagemin',
                'htmlmin'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dist %>/js',
                        src: '*.js',
                        dest: '<%= config.dist %>/js'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/js/scripts.js': [
                        '<%= config.dist %>/js/scripts.js'
                    ]
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/js/**/*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '!<%= config.dist %>/js/lib/**/*.js'
                    ]
                }
            }
        } ,
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }
        grunt.task.run([
            'clean:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'copy',
        'ngmin',
        'uglify',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', ['build']);
};

