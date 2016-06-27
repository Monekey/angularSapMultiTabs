/*
var gulp = require('gulp');
var less = require('gulp-less');
var eslint = require('gulp-eslint');
var ngmin = require('gulp-ngmin');
var htmlmin = require("gulp-htmlmin");
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
//const imagemin = require('gulp-imagemin');


var distPath = 'resources/dist/';
var basePath = 'resources/';
//var appPath = basePath + 'webapp/';
//var libPath = basePath + 'bower_components/';

gulp.task('prod', ['prod:module','prod:service','prod:static','prod:page','prod:lib']);


/!*=========================== module 压缩 ===========================*!/
gulp.task('prod:module', [], function() {
    gulp.src(basePath + 'module/!*!/template/!*.html',{ base: 'resources' })
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(distPath));

    return gulp.src(basePath + 'module/!*!/directive/!*.js',{ base: 'resources' })
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(uglify())
        .pipe(gulp.dest(distPath));
});

/!*=========================== service 压缩 ===========================*!/
gulp.task('prod:service', [], function() {
    var files = [
        (basePath + '*.js'),
        (basePath + 'service/!*.js')
    ];

    return gulp.src(files,{ base: 'resources' })
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(uglify())
        .pipe(gulp.dest(distPath));
});

/!*=========================== 静态文件拷贝 ===========================*!/
gulp.task('prod:static', [], function() {
    var files = [
        (basePath + 'assets/fonts/!*'),
        (basePath + 'assets/images/!*')
    ];

    gulp.src(basePath + 'assets/fonts/!*',{ base: 'resources' })
        .pipe(gulp.dest(distPath));

    gulp.src(basePath + 'assets/images/!*',{ base: 'resources' })
        //.pipe(imagemin())
        .pipe(gulp.dest(distPath));

    return gulp.src(basePath + 'assets/css/!*.css',{ base: 'resources' })
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest(distPath));
});

/!*=========================== page文件压缩 ===========================*!/
gulp.task('prod:page', [], function() {
    var htmlfiles =  [
        (basePath + 'page/!*!/!*.html'),
        (basePath + 'page/!*!/!*!/!*.html')
    ];

    gulp.src(htmlfiles,{ base: 'resources' })
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(distPath));

    var jsfiles = [
        (basePath + 'page/!*!/!*.js'),
        (basePath + 'page/!*!/!*!/!*.js')
    ];
    return gulp.src(jsfiles,{ base: 'resources' })
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(uglify())
        .pipe(gulp.dest(distPath));
});

/!*=========================== lib文件压缩 ===========================*!/
gulp.task('copypage',[], function(){
    gulp.src(basePath+'lib/!*',{ base: 'resources' })
        .pipe(gulp.dest(distPath));

    return gulp.src(basePath+'lib/!*!/!*',{ base: 'resources' })
        .pipe(gulp.dest(distPath));
});

gulp.task('prod:lib', ['copypage'], function() {
    var jsfiles = [
        (basePath + 'lib/!*!/!*.js'),
        (basePath + 'lib/!*.js')
    ];
    return gulp.src(jsfiles,{ base: 'resources' })
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(uglify())
        .pipe(gulp.dest(distPath));
});*/


var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');

var basePath = 'resources/';

gulp.task('scripts', function () {
    var files = [
        (basePath + '*.js'),
        (basePath + 'lib/*/*'),
        (basePath + 'lib/*.js'),
       (basePath + 'module/*/directive/*.js'),
       (basePath + 'service/*.js'),
    ];

   /* return gulp.src(files,{ base: 'resources'})
        .pipe(requirejsOptimize(function(file) {
            //console.log(file.relative);
            return {
                appDir: 'resources/',
                baseUrl: 'resources/page',
                dir:'resources/dist',
                modules: [
                    {
                        name: 'main'
                    }
                ],
                optimize: 'uglify',
                optimizeCss: 'standard',
                //useStrict: true,

                mainConfigFile: 'resources/config.js',
               //include: '../' + file.relative,
                //indNestedDependencies: true,
               // removeCombined: true,
                //inlineText: true,
            };
        }))
        .pipe(gulp.dest('dist'));*/

    var files = [
        (basePath + 'app.js'),
        (basePath + '*.js'),
        (basePath + 'lib/*/*'),
        (basePath + 'lib/*.js'),
        (basePath + 'module/*/directive/*.js'),
        (basePath + 'service/*.js'),
        (basePath + 'page/*/*'),
        (basePath + 'page/*/*/*'),
        (basePath + 'page/*/*.js'),
        (basePath + 'page/*/*/*.js'),
    ];

    return gulp.src(files,{ base: 'resources'})
        .pipe(requirejsOptimize(function(file) {
            return {
                baseUrl: 'resources/page',
                optimize: 'uglify',
                include: '../' + file.relative,
                optimizeCss: 'standard',
            };
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('prod:page', [], function() {
    var htmlfiles =  [
        (basePath + 'module/*/template/*.html'),
        (basePath + 'page/*/*.html'),
        (basePath + 'page/*/*/*.html')
    ];

    gulp.src(htmlfiles,{ base: 'resources' })
        .pipe(gulp.dest('dist'));
});


gulp.task('prod:static', [], function() {
    var files = [
        (basePath + 'assets/fonts/*'),
        (basePath + 'assets/images/*'),
        (basePath + 'lib/*/*.css')
    ];

    gulp.src(basePath + 'assets/fonts/*',{ base: 'resources' })
        .pipe(gulp.dest('dist'));

    gulp.src(basePath + 'assets/images/*',{ base: 'resources' })
        .pipe(gulp.dest('dist'));

    return gulp.src(basePath + 'assets/css/*.css',{ base: 'resources' })
        .pipe(gulp.dest('dist'));
});
