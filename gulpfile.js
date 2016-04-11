var
    gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    del          = require('del'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    minifyCSS    = require('gulp-minify-css'),
    templateCache= require('gulp-angular-templatecache'),
    gulpif       = require('gulp-if'),
    minify       = true,
    buildSources = {
        allCss:  [
            'css/style.css'
        ],
        allJs: [
            'js/common/utils.js',
            'js/common/init.js',
            'js/common/constants.js',
            'js/common/routes.js',
            'js/common/services.js',
            'js/common/controllers.js',
            'js/common/directives.js',
            'js/auth/init.js',
            'js/auth/services.js',
            'js/auth/controllers.js',
            'js/dashboard/services.js',
            'js/dashboard/controllers.js',
            'js/logSearch/menu/services.js',
            'js/logSearch/menu/controllers.js',
            'js/logSearch/view/services.js',
            'js/logSearch/view/controllers.js'
        ]
    };

gulp.task('clean', function() {
    del([
        'styles.css',
        'scripts.js'
    ], {force: true});
});

gulp.task('allCss', function() {
    // Minify and concatenate styles for all css files
    return gulp.src(buildSources.allCss)
        .pipe(concat('styles.css'))
        .pipe(gulpif(minify, minifyCSS()))
        .pipe(gulp.dest('compiled/css'))
        .on('error', gutil.log);
});

gulp.task('allJs', function() {
    // Minify and concatenate scripts for all.js
    return gulp.src(buildSources.allJs)
        .pipe(gulpif(minify, uglify()))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('compiled/js'))
        .on('error', gutil.log);
});

//gulp.task('build', ['clean', 'allCss', 'allJs']);
gulp.task('build', ['allCss', 'allJs']);

gulp.task('dev', function() {
    minify  = false;
});

gulp.task('templates', function () {
    return gulp.src('templates/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'SpamExpertsApp'
        }))
        .pipe(gulp.dest('compiled/html'))
        .on('error', gutil.log);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'templates']);
