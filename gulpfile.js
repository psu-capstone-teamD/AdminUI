var gulp = require('gulp')
var Server = require('karma').Server;
var webserver = require('gulp-webserver')
/* Run our tests once, then quit */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
gulp.task('serve', function (done) {
    gulp.src('app')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});
