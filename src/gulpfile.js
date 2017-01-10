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
    sass         = require('gulp-sass'),
    strip        = require('gulp-strip-comments'),

    minify       = true,

    buildSources = {
        allCss:  [
            'css/style.scss'
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
            'lib/ionic/fonts/ionicons.eot',
            'lib/ionic/fonts/ionicons.svg',
            'lib/ionic/fonts/ionicons.ttf',
            'lib/ionic/fonts/ionicons.woff'
        ],
        allCss:  [
            'lib/ionic/css/ionic.min.css',
            'lib/ion-datetime-picker/release/ion-datetime-picker.min.css'
        ],
        allJs: [
            'lib/ionic/js/ionic.bundle.min.js',
            'lib/ion-datetime-picker/release/ion-datetime-picker.min.js',
            'lib/ngCordova/dist/ng-cordova.min.js'
        ]
    };

function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

function newFile(name, contents) {
    //uses the node stream object
    var readableStream = require('stream').Readable({ objectMode: true });
    //reads in our contents string
    readableStream._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: name, contents: new Buffer(contents) }));
        this.push(null);
    };
    return readableStream;
}

function enableProxy() {
    gulp.src('../minified/js/scripts.js')
        .pipe(
            replace(
                /\.constant\(.DEV_PROXY.\,(\s|).DEV_PROXY_FALSE.\)/,
                '.constant("DEV_PROXY","DEV_PROXY_TRUE")'
            )
        )
        .pipe(gulp.dest('../minified/js'));
}

gulp.task('templates', function () {
    return gulp.src('templates/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'SpamExpertsApp',
            root: 'templates'
        }))
        .pipe(gulp.dest('../minified/templates'))
        .on('error', gutil.log);
});

gulp.task('allCss', function() {
    gulp.src(buildSources['allCss'])
        .pipe(concat('styles.css'))
        .pipe(sass())
        .pipe(gulpif(minify, minifyCSS()))
        .pipe(gulp.dest('../minified/css'))
        .on('error', sass.logError);
});

gulp.task('allJs', function() {
    // Minify and concatenate scripts for all.js

    gulp.src(buildSources.allJs)
        .pipe(strip())
        .pipe(gulpif(minify, uglify()))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('../minified/js'))
        .on('end', function () {
            var config = require('../../ionic.config.json');

            if (config['proxies'].length) {
                enableProxy();
            }
        })
        .on('error', gutil.log);
});

gulp.task('allLib', function() {
    // Minify and concatenate styles for all css files
    gulp.src(dependency.allCss)
        .pipe(concat('all.css'))
        .pipe(gulp.dest('../minified/lib'))
        .on('error', gutil.log);

    gulp.src(dependency.fonts)
        .pipe(gulp.dest('../minified/fonts'))
        .on('error', gutil.log);

    // Minify and concatenate scripts for all.js
    gulp.src(dependency.allJs)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('../minified/lib'))
        .on('error', gutil.log);
});

gulp.task('add-proxy', function() {
    var config = require('./config/ionic.config.json');
    var server = getArg("--server");

    if (!server) {
        throw new gutil.PluginError({
            plugin: 'add-proxy',
            message: 'Please enter proxy server. gulp add-proxy --server yourserver'
        });
    } else {
        config['proxies'] = [{
            "path": "/rest",
            "proxyUrl": "http://" + server + "/rest"
        }];

        del(['../../ionic.config.json'], {force: true});

        new newFile('ionic.config.json', JSON.stringify(config, null, 2))
            .pipe(gulp.dest('../../'))
            .on('end', function () {
                enableProxy();
            });

    }
});

gulp.task('remove-proxy', function() {

    gulp.src('config/ionic.config.json')
        .pipe(gulp.dest('../../'));

    gulp.src('../minified/js/scripts.js')
        .pipe(
            replace(
                /\.constant\(.DEV_PROXY.\,(\s|).DEV_PROXY_TRUE.\)/,
                '.constant("DEV_PROXY","DEV_PROXY_FALSE")'
            )
        )
        .pipe(gulp.dest('../minified/js'));
});

gulp.task('clean', function() {
    del([
        '../minified/**/*.*'
    ], {force: true});
});

gulp.task('build', ['templates', 'allCss', 'allJs', 'allLib']);

gulp.task('dev', function() {
    minify  = false;
    gutil.log(gutil.colors.green('RUNNING IN DEBUG MODE'));
    gulp.start('default');
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});