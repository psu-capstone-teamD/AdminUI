var gulp = require('gulp')
var Server = require('karma').Server;

/* Run our tests once, then quit */
gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
