'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var crisper = require('../');

var TEST_FILE = 'test/fixtures/index.html';
var JS_OUTPUT_FILE_NAME = 'output.js';

describe('Split inline scripts from an HTML file', function (argument) {
	it('single', function (cb) {
		var stream = crisper({
			jsFileName: JS_OUTPUT_FILE_NAME
		});

		stream.on('data', function (file) {

			var basename = path.basename(file.path);
			if (basename === JS_OUTPUT_FILE_NAME) {

				assert(~file.contents.toString().indexOf('works!'));
				assert(~file.contents.toString().indexOf('window.$'));

			} else if (basename === path.basename(TEST_FILE)) {

				assert(~file.contents.toString().indexOf(JS_OUTPUT_FILE_NAME));

			}
		});

		stream.on('end', cb);

		stream.write(new gutil.File({
			cwd: __dirname,
			base: path.dirname(TEST_FILE),
			path: TEST_FILE,
			contents: fs.readFileSync(TEST_FILE)
		}));

		stream.end();
	});
});
