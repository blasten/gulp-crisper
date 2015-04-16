# gulp-crisper

> Split inline scripts from an HTML file for CSP compliance with [Crisper](https://github.com/PolymerLabs/crisper)

## Install

```sh
$ npm install --save-dev gulp-crisper
```

## Usage

```js
var gulp = require('gulp');
var crisper = require('gulp-crisper');

gulp.task('default', function () {
	return gulp.src('src/index.html')
		.pipe(crisper({
			jsFileName: 'dependencies.js'
		}))
		.pipe(gulp.dest(DEST_DIR));
});
```

## API

### crisper(options)

``options.jsFileName`` - Name of the javascript file that will contain all the inline scripts from the HTML file.