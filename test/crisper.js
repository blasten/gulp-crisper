'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var crisper = require('../');

var TEST_FILE = 'test/fixtures/index.html';
var JS_OUTPUT_FILE_NAME = 'output.js';

describe('Split inline scripts from an HTML file', function (argument) {
	it('single', function (cb) {
		var stream = crisper({
			jsFileName: JS_OUTPUT_FILE_NAME
		});

		var expectedFiles = 3;
		var generatedFiles = 0;

		stream.on('end', function() {
			assert.equal(generatedFiles, expectedFiles);
			cb();
		});

		stream.on('data', function (file) {
			var basename = path.basename(file.path);

			if (basename === JS_OUTPUT_FILE_NAME) {
				generatedFiles = generatedFiles | 1 << 0;

				assert(file.contents.toString().indexOf('works!') !== -1);
				assert(file.contents.toString().indexOf('window.$') !== -1);

			} else if (basename === path.basename(TEST_FILE)) {

				generatedFiles = generatedFiles | 1 << 1;
				assert(file.contents.toString().indexOf(JS_OUTPUT_FILE_NAME) !== -1);

			}
		});

		stream.write(new gutil.File({
			cwd: __dirname,
			base: path.dirname(TEST_FILE),
			path: TEST_FILE,
			contents: fs.readFileSync(TEST_FILE)
		}));

		stream.end();
	});
});
