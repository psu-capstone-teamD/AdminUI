var gulp = require('gulp')

// Placeholder file for now, needs to be changed
var placeholder = '../index.html'

gulp.task('build', function() {
    gulp.src(placeholder).pipe(gulp.dest('../')); // For now, export in the root directory
});

gulp.task('default', ['build'], function() {
    gulp.watch(placeholder, ['build']);
});