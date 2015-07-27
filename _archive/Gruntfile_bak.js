module.exports = function (grunt) {

    // globs where our JS files are found - used below in uglify and watch
    var jsFilePaths = [
        'js/*.js',
        'js/app/**/*.js',
        '../../userfrosting/bower/app/*.js',
        '../../userfrosting/bower/app/**/js/*.js'
    ];

    var jsConcatFilePaths = [
        'js/app/**/*.js',
        '../../userfrosting/bower/app/**/js/*.js'
    ];
    var jsSNFilePaths = [
        'js',
        '../../userfrosting/bower'
    ];

    module.exports = {
        options: {
            cache: false
        },
        dist: {
            files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'src/', // src matches are relative to this path
                    src: ["**/*.{png,jpg,gif}"], // Actual patterns to match
                    dest: 'dist/'            // Destination path prefix
                }]
        }
    };
    // Project configuration
    grunt.initConfig({
        // you can read in JSON files, which are then set as objects. We use this below with banner
        pkg: grunt.file.readJSON('package.json'),
        // setup some variables that we'll use below
        appDir: 'assets',
        builtDir: '../public/assets',
        ufDir: '../../userfrosting/bower',
        ufDir2: '../userfrosting/bower',
        requirejs: {
            // creates a "main" requirejs sub-task (grunt requirejs:main)
            // we *could* have other sub-tasks for using requirejs with other
            // files or configuration
            main: {
                options: {
                // a cute way to put a banner on each file
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd , h:MM:ss TT") %> */\n',
                    mainConfigFile: '<%= appDir %>/js/common.js',
                    appDir: '<%= appDir %>',
                    baseUrl: './js',
                    dir: '<%= builtDir %>',
                    // will be taken care of with compass
                    optimizeCss: "none",
                    // will be taken care of with an uglify task directly
                    optimize: "none",
                    /**
                     * The list of modules that should have their dependencies packed into them.
                     *
                     * For each module listed here, Require.js will read
                     * that modules dependencies and package them in the
                     * file. It will additionally add in any modules (and
                     * their dependencies) specified in the "include" and
                     * exclude any modules (and their dependencies) specified
                     * in "exclude".
                     */
                    modules: [
                        // First set up the common build layer.
                        {
                            // module names are relative to baseUrl
                            name: 'common',
                            // List common dependencies here. Only need to list
                            // top level dependencies, "include" will find
                            // nested dependencies inside each of these
                            include: ['jquery', 'domReady', 'bootstrap']
                        },
                        // Now set up a build layer for each page, but exclude
                        // the common one. "exclude" will exclude nested
                        // the nested, built dependencies from "common". Any
                        // "exclude" that includes built modules should be
                        // listed before the build layer that wants to exclude it.
                        // "include" the appropriate "app/main*" module since by default
                        // it will not get added to the build since it is loaded by a nested
                        // require in the page*.js files.
                        {
                            // module names are relative to baseUrl/paths config
                            name: 'app/homepage',
                            exclude: ['common']
                        }
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: ['assets/**'], dest: 'public'}
                ]
            }
        },
        clean: {
            build: {
                src: ['<%= builtDir %>/**']
            },
            sass: {
                src: ['<%= appDir %>/sass']
            }
        },
        uglify: {
            options: {
                // a cute way to put a banner on each uglified file
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd , h:MM:ss TT") %> */\n'
            },
//            min: {
//                files: grunt.file.expandMapping(jsFilePaths, '<%= builtDir %>', {
//                    rename: function(destBase, destPath) {
//                        return destBase+destPath.replace('.js', '.min.js');
//                    }
//                })
//            },
            build: {
                /*
                 * I'm not sure if finding files recursively is possible. This is
                 * a bit ugly, but it accomplishes the task of finding all files
                 * in the built directory (that we want) and uglifying them.
                 *
                 * Additionally, I created a little self-executing function
                 * here so that I could re-use the jsFilePaths from above
                 *
                 * https://github.com/gruntjs/grunt-contrib-uglify/issues/23
                 */
                files: (function () {

                    var files = [];
                    jsFilePaths.forEach(function (val) {
                        files.push({
                            expand: true, // Enable dynamic expansion.
                            cwd: '<%= appDir %>', // Src matches are relative to this path.
                            src: val, // Actual pattern(s) to match.
                            dest: '<%= builtDir %>', // Destination path prefix.
                            ext: '.min.js', // Dest filepaths will have this extension.
                            extDot: 'first'   // Extensions in filenames begin after the first dot
                            , rename: function (dest, src) {
                                return dest + '/' + src.replace(grunt.config('ufDir')+'/', '');
                            }
//                            ,flatten: true  // remove all unnecessary nesting
                        });
                    });
                    return files;
                })()
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['<%= appDir %>/app/**/*.js'],
                // the location of the resulting JS file
                dest: '<%= builtDir %>/<%= pkg.name %>.js'
            }
        },
        uglyfolders: {
            app: {
                options: {
                    src: '<%= appDir %>/js/app'
                    , target: '<%= builtDir %>/js'
                    , renameFile: function (target, src) {
                        return target + '/' + src.replace(grunt.config('ufDir')+'/', '');
                    }
                }
            },
            ufdir: {
                options: {
                    src: '<%= ufDir2 %>/app'
                    , target: '<%= builtDir %>/js'
                    , renameFile: function (target, src) {
                        return target + '/' + src.replace(grunt.config('ufDir2')+'/', '');
                    }
                }
            }
            
        },
        sass: {
          app: {
            files: [{
              expand: true,
              cwd: '<%= appDir %>',
              src: ['sass/*.scss'],
              dest: '<%= builtDir %>/sass',
              ext: '.css'
            }]
          },
          ufdir: {
            files: [{
              expand: true,
              cwd: '<%= ufDir2 %>',
              src: ['app/**/sass/*.scss'],
              dest: '<%= builtDir %>/sass',
              ext: '.css'
            }]
          }
        },        
        imagemin: {
            options: {
                cache: false
            },
            dist: {
                files: [{
                        expand: true, // Enable dynamic expansion
                        cwd: '<%= appDir %>/images/', // src matches are relative to this path
                        src: ["**/*.{png,jpg,gif}"], // Actual patterns to match
                        dest: '<%= builtDir %>/images/'            // Destination path prefix
                    }]
            }
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= appDir %>/js/**/*.js'
            ]
        },
        // use compass to compile everything in the "sass" directory into "css"
        compass: {
            // the "production" build subtask (grunt compass:dist)
            app: {
                options: {
                    sassDir: '<%= appDir %>/sass',
                    cssDir: '<%= builtDir %>/css',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            },
            ufdir: {
                options: {
                    sassDir: '<%= ufDir2 %>/app/**/sass',
                    cssDir: '<%= builtDir %>/app/css',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            },
            // the "development" build subtask (grunt compass:dev)
            dev: {
                options: {
                    sassDir: '<%= appDir %>/sass',
                    cssDir: '<%= builtDir %>/css',
                    outputStyle: 'expanded'
                }
            }
        },
        // run "Grunt watch" and have it automatically update things when files change
        watch: {
            // watch all JS files and run jshint
            scripts: {
                // self executing function to reuse jsFilePaths, but prefix each with appDir
                files: (function () {
                    var files = [];
                    jsFilePaths.forEach(function (val) {
                        files.push('<%= appDir %>/' + val);
                    });

                    return files;
                })(),
                tasks: ['copy', 'jshint'],
                options: {
                    spawn: false
                }
            },
            // watch all .scss files and run compass
            compass: {
                files: '<%= appDir %>/sass/*.scss',
                tasks: ['copy', 'compass:dev'],
                options: {
                    spawn: false
                }
            }
        }

    });

    // Load tasks from our external plugins. These are what we're configuring above
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ugly-folders');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');    

    // sub-task that copies assets to web/assets, and also cleans some things
    grunt.registerTask('copy:assets', ['clean:build', 'copy', 'clean:sass']);

    // the "default" task (e.g. simply "Grunt") runs tasks for development
    grunt.registerTask('default', ['copy:assets', 'jshint', 'compass:dev']);

    // register a "production" task that sets everything up before deployment
    grunt.registerTask('production', ['copy:assets', 'jshint', 'requirejs', 'uglify', 'compass:dist']);
};
