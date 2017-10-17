/* global define */
define(function() {

	return {
		read: function(str /* opts */) {
			return str.split('\n');
		},
		write: function(obj /* opts */) {
			if(obj instanceof Array) {
				return obj.map(function(resource) {
					return resource._links.self.href;
				}).join('\n');
			} else {
				return obj._links.self.href;
			}
		}
	};
});