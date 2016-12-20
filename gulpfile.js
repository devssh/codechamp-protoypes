var gulp = require('gulp');
var git = require('gulp-git');

gulp.task('editor', function() {
  console.log("Cloning Ace Editor in background...");
  git.clone('https://github.com/ajaxorg/ace-builds.git',
            {args:'./app/ace-builds'}, function(err) {
    if (err) throw err;
  });
});

