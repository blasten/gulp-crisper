'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var crisper = require('crisper');

module.exports = function (opts) {
	opts = opts || {};
	var currentjsFileName = opts.jsFileName;

	return through.obj(function (file, enc, cb) {

		opts.jsFileName = currentjsFileName || path.basename(file.path, '.html') + '.js';

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-crisper', 'Streaming not supported'));
			return;
		}

		try {
			var obj = crisper.split(file.contents.toString(), opts.jsFileName);

			if (typeof obj.html === 'string' && typeof file.path === 'string') {
				this.push(new gutil.File({
					cwd: file.cwd,
					base: path.dirname(file.path),
					path: file.path,
					contents: new Buffer(obj.html)
				}));

				this.push(new gutil.File({
					cwd: file.cwd,
					base: path.dirname(file.path),
					path: path.join(path.dirname(file.path), opts.jsFileName),
					contents: new Buffer(obj.js)
				}));

				cb();
			} else {
				cb(new gutil.PluginError('gulp-crisper', 'Unexpected output'));
			}
		} catch (err) {
			cb(new gutil.PluginError('gulp-crisper', err, {fileName: file.path}));
		}
	});
};
