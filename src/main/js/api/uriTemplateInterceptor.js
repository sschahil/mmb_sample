define(function(require) {
	var interceptor = require('rest/interceptor');

	return interceptor({
		request: function(request /*, config, meta */) {
			if(request.path.indexOf('{') === -1) {
				return request;
			} else {
				request.path = request.path.split('{')[0];
				return request;
			}
		}
	});
});