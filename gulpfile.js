var
    gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    del          = require('del'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    minifyCSS    = require('gulp-minify-css'),
    templateCache= require('gulp-angular-templatecache'),
    gulpif       = require('gulp-if'),
    replace      = require('gulp-replace'),

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
            'js/logSearch/menu/services.js',
            'js/logSearch/menu/controllers.js',
            'js/logSearch/view/services.js',
            'js/logSearch/view/controllers.js'
        ]
    },

    dependency = {
        fonts: [
            'lib/material-design-icons/iconfont/MaterialIcons-Regular.eot',
            'lib/material-design-icons/iconfont/MaterialIcons-Regular.ijmap',
            'lib/material-design-icons/iconfont/MaterialIcons-Regular.svg',
            'lib/material-design-icons/iconfont/MaterialIcons-Regular.ttf',
            'lib/material-design-icons/iconfont/MaterialIcons-Regular.woff',
            'lib/material-design-icons/iconfont/MaterialIcons-Regular.woff2'
        ],
        allCss:  [
            'lib/material-design-icons/iconfont/material-icons.css',
            'lib/angular-material/angular-material.min.css'
        ],
        allJs: [
            'lib/angular/angular.min.js',
            'lib/angular-ui-router/release/angular-ui-router.min.js',
            'lib/angular-sanitize/angular-sanitize.min.js',
            'lib/angular-animate/angular-animate.min.js',
            'lib/angular-aria/angular-aria.min.js',
            'lib/angular-material/angular-material.min.js',
            'lib/ngCordova/dist/ng-cordova.min.js'
        ]
    };

gulp.task('clean', function() {
    del([
        'minified/css/styles.css',
        'minified/js/scripts.js',
        'minified/templates/templates.js'
    ], {force: true});
});

gulp.task('allCss', function() {
    // Minify and concatenate styles for all css files
    return gulp.src(buildSources.allCss)
        .pipe(concat('styles.css'))
        .pipe(gulpif(minify, minifyCSS()))
        .pipe(gulp.dest('minified/css'))
        .on('error', gutil.log);
});

gulp.task('allJs', function() {
    // Minify and concatenate scripts for all.js
    return gulp.src(buildSources.allJs)
        .pipe(gulpif(minify, uglify()))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('minified/js'))
        .on('error', gutil.log);
});


gulp.task('allLib', function() {
    // Minify and concatenate styles for all css files
    gulp.src(dependency.allCss)
        .pipe(concat('all.css'))
        .pipe(gulpif(minify, minifyCSS()))
        .pipe(gulp.dest('minified/lib'))
        .on('error', gutil.log);

    gulp.src(dependency.fonts)
        .pipe(gulp.dest('minified/lib'))
        .on('error', gutil.log);

    // Minify and concatenate scripts for all.js
    gulp.src(dependency.allJs)
        .pipe(gulpif(minify, uglify()))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('minified/lib'))
        .on('error', gutil.log);
});

gulp.task('build', ['clean', 'allCss', 'allJs', 'allLib']);

gulp.task('dev', function() {
    minify  = false;
});

gulp.task('add-proxy', function() {
    return gulp.src('minified/js/scripts.js')
        .pipe(
            replace(
                "\.constant\('DEV_PROXY', 'DEV_PROXY_FALSE'\)",
                '.constant("DEV_PROXY", "DEV_PROXY_TRUE")'
            )
        )
        .pipe(gulp.dest('minified/js'));
});

gulp.task('remove-proxy', function() {
    return gulp.src('minified/js/scripts.js')
        .pipe(
            replace(
                '\.constant\("DEV_PROXY", "DEV_PROXY_TRUE"\)',
                '.constant("DEV_PROXY", "DEV_PROXY_FALSE")'
            )
        )
        .pipe(gulp.dest('minified/js'));
});

gulp.task('templates', function () {
    return gulp.src('templates/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'SpamExpertsApp',
            root: 'templates'
        }))
        .pipe(gulp.dest('minified/templates'))
        .on('error', gutil.log);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'templates']);

gulp.task('watch', ['dev', 'default'], function() {
    gulp.watch(buildSources.allCss, ['allCss']);
    gulp.watch(buildSources.allJs, ['allJs']);
    gulp.watch('templates/**/*.html', ['templates']);
});