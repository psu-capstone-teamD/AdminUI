// Karma configuration
// Generated on Sun Jun 25 2017 11:11:15 GMT-0700 (PDT)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
            'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-route.js',
            'https://cdn.jsdelivr.net/npm/hls.js@latest',
            './node_modules/angular-mocks/angular-mocks.js',
            'js/test/*.spec.js',
            'app/app.js',
            'app/services/*.js',
            'app/controllers/*.js', // can uncomment once all of the controllers are complete
            'app/directives/*.directive.js',
            'app/bower_components/aws-sdk-js/dist/aws-sdk.min.js',
			'app/bower_components/jquery/dist/jquery.min.js',
			'app/bower_components/toastr/toastr.min.js',
            'app/bower_components/angular-uuids/angular-uuid.js',
            'app/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'app/bower_components/angular-ui-sortable/sortable.min.js',
			'clientapp/app.js',
			'clientapp/controllers/*',
        ],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-coverage'
        ],

        // list of files to exclude
        exclude: [
            'no'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // Specify the files to be examined for code coverage
            'app/controllers/*.js':['coverage'],
            'app/services/*.js':['coverage'],
            'app/app.js':['coverage'],
			'clientapp/app.js':['coverage'],
			'clientapp/controllers/*.js':['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // report code coverage in a pretty HTML file
        coverageReporter: {
            type: 'lcov',
            dir: 'reports'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
           'PhantomJS'
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

    })
}