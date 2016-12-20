var gulp = require('gulp');
var git = require('gulp-git');
var clean = require('gulp-clean');

gulp.task('editor', function() {
  console.log("Cloning Ace Editor...");
  git.clone('https://github.com/ajaxorg/ace-builds.git',
            {args:'./app/ace-builds'}, function(err) {
    if (err) {
	gulp.src('app/ace-builds', {read: false})
        .pipe(clean());
	throw err;
    }
  });
  console.log("Gulp has promised to clone the editor...");
  console.log("This may take a few minutes depending on internet speeds...");
});

