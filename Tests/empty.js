var tahini = require('../index');

describe('EmptyWriter', function() {
	it('should complete without error', function() {
		tahini.createWriter(__dirname + '/output/EmptyWriter.pdf').end();
	});
});