/* The EDQ library */

(function() {
	var root = this;
	var previousEdq = root.EDQ;

	/* Creates a reference to the EDQ object
	 *
	 * @param {Object} object
	 * @returns undefined
	 */
	var EDQ = function(object) {
		if (object instanceof EDQ) return object;
		if (!(this instanceof EDQ)) return new EDQ;
		this._wrapped = object;
	}


	EDQ.VERSION = '0.1';


	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = EDQ;
		}

		exports.EDQ = EDQ;
	} else {
		root.EDQ = EDQ;
	}

	EDQ.address = {

		proWeb: {

			doSearch: function() {
				return 1;
			}
		}
	}

}).call(this);
