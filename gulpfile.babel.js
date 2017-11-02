'use strict';

import gulp from 'gulp';
import del from 'del';
import plugins from 'gulp-load-plugins';
import browser from 'browser-sync';
import sass from 'gulp-sass';

const $ = plugins();

const dirs = {
  src: 'src/',
  dest: 'build/'
};

const paths = {
	css: {
		src: dirs.src + 'css/**/*',
		dest: dirs.dest + 'css',
	},
	js: {
		src: dirs.src + 'js/**/*',
		dest: dirs.dest + 'js',
	},
	html: {
		src: dirs.src + 'html/**/*',
		dest: dirs.dest,
	}
}

const vendorScripts = [
	'node_modules/angular/angular.js',
	'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js'
]

function cleanup () {
  return del('dist', {force: true});
}

function html () {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .on('end', () => {
      $.util.log($.util.colors.green('HTML compiled'));
    });
}

function css () {
  return gulp.src(paths.css.src)
    .pipe($.sourcemaps.init())
    .pipe(sass.sync({
		      outputStyle: 'compressed',
		      includePaths: [paths.css.src, './node_modules']
		    }
		).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browser.stream())
    .on('end', () => {
      $.util.log($.util.colors.green('Styles compiled'));
    });
}

function js () {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest))
    .on('end', () => {
      $.util.log($.util.colors.green('JS compiled'));
    });
}

function vendors () {
  return gulp.src(vendorScripts)
  	.pipe($.plumber())
  	.pipe($.concat('vendors.js'))
  	.pipe($.uglify())
    .pipe(gulp.dest(paths.js.dest))
    .on('end', () => {
      $.util.log($.util.colors.green('Vendors compiled'));
    });
}

function server (done) {
  browser.init({
    server: dirs.dest,
    startPath: '/'
  });
  done();
}

function watch () {
  gulp.watch(paths.html.src).on('change', gulp.series(html, browser.reload));
  gulp.watch(paths.css.src).on('change', css);
  gulp.watch(paths.js.src).on('change', gulp.series(js, browser.reload));
}

gulp.task('default', gulp.series (cleanup, html, css, vendors, js, server, watch));
