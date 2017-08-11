var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

//監視するファイルのパス
var path = {
	watch : [
		'docs/**/*',
		'!docs/**/*.scss'
	],
	sass  : {
		src : 'src/**/*.scss',
		dest: 'docs'
	},
	ejs   : {
		src : ['src/**/*.html', '!src/**/_*.ejs'],
		dest: 'docs'
	},
	assets: {
		src : ['src/assets/**/*', '!src/assets/include/', '!src/assets/include/**/*'],
		dest: 'docs/assets'
	}
};

gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir       : 'docs',
			reloadThrottle: 500,
		},
		open  : false,
	});
});

gulp.task('scss', function () {
	return gulp.src(path.sass.src)
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
		}))
		.pipe($.sass({outputStyle: 'compressed'}))
		.pipe($.autoprefixer(['last 3 versions', 'ie >= 8', 'Android >= 4', 'iOS >= 8']))
		.pipe(gulp.dest(path.sass.dest));
});

gulp.task('ejs', function () {
	return gulp.src(path.ejs.src)
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
		}))
		.pipe($.ejs())
		.pipe(gulp.dest(path.ejs.dest));
});

gulp.task('assets_copy', function () {
	return gulp.src(path.assets.src)
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
		}))
		.pipe(gulp.dest(path.assets.dest));
});

gulp.task('watch', function () {
	gulp.watch(path.watch, {interval: 500}, browserSync.reload);
	gulp.watch(path.ejs.src, {interval: 500}, ['ejs']);
	gulp.watch(path.sass.src, {interval: 500}, ['scss']);
	gulp.watch(path.assets.src, {interval: 500}, ['assets_copy']);
});

gulp.task('default', ['browser-sync', 'ejs', 'scss', 'assets_copy', 'watch']);