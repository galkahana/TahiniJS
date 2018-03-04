var tahini = require('../Tahini');

describe('EmptyWriter', function() {
	it('should complete without error', function() {
		tahini.createWriter(__dirname + '/output/EmptyWriter.pdf').end();
	});
});