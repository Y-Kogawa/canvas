var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var $           = require('gulp-load-plugins')();

var inputDir  = './src/';
var outputDir = './dist/';

//監視するファイルのパス
var watchFiles = {
	ejs: {
		src: [inputDir + '**/*.html', '!' + inputDir + '**/_*.ejs'],
		dist: outputDir
	},
	assets: {
		src: [inputDir + 'assets/**/*', '!' + inputDir + 'assets/include/*', '!' + inputDir + 'assets/include/'],
		dist: outputDir
	}
};

gulp.task('browser-sync', function () {
	browserSync.init({
		// Webアプリケーションが動作しているアドレス(例ではIPアドレス)
		// proxy: '192.168.33.69',
		server: {
			baseDir: './',
		},
		open: false,
		notify: false
	});
});

// EJS
gulp.task('ejs', function () {
	return gulp.src(watchFiles.ejs.src)
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
		}))
		.pipe($.ejs())
		//.pipe($.changed(watchFiles.ejs.dist))
		.pipe(gulp.dest(watchFiles.ejs.dist));
});

// Assets Copy
gulp.task('assets_copy', function () {
	return gulp.src(watchFiles.assets.src, {base: inputDir})
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
		}))
		.pipe($.changed(watchFiles.assets.dist))
		.pipe(gulp.dest(watchFiles.assets.dist));
});

gulp.task('watch', function () {
	//gulp.watch(watchFiles.ejs.src, {interval: 500}, browserSync.reload);
	gulp.watch(watchFiles.ejs.src, {interval: 500}, ['ejs']);
	gulp.watch(outputDir + '/**/*', {interval: 500}, browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);