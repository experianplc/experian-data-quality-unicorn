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

	function _proWebHelpers() {

		this.webServiceUrl = 'https://ws2.ondemand.qas.com/ProOnDemand/V3/ProOnDemandService.asmx';

		this.helpFn = function() {
		};

		this.doCanSearch = function() {
			let soapActionUrl = '';

		};

		this.doGetAddress = function() {
		};

		this.doGetData = function() {
		};

		this.doGetDataMapDetail = function() {
		};

		this.doGetExampleAddresses = function() {
		};

		this.doGetLayouts =  function() {
		};

		this.doGetLicenseInfo = function() {
		};

		this.doGetPromptSet = function() {
		};

		this.doRefine = function() {
		};


		/* @param {String} country
		 * @param {String} engineOptions
		 * @param {String} engineType
		 * @param {String} layout
		 * @param {String} addressQuery
		 * @param {Boolean} formattedAddressInPicklist
		 *
		 * @returns {String}
		 */
		this.doSearch = function({country, engineOptions, engineType, layout, addressQuery, formattedAddressInPicklist}) {
			const xmlString = buildDoSearchMessage(...arguments);
			return xmlString;
		};


		/* @param {String} country
		 * @param {String} engineOptions
		 * @param {String} engineType
		 * @param {String} layout
		 * @param {String} addressQuery
		 * @param {Boolean} formattedAddressInPicklist
		 *
		 * @returns {String}
		 */
		this.buildDoSearchMessage({country, engineOptions, engineType, layout, addressQuery, formattedAddressInPicklist}) = function() {
			const xmlString =
				'<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
				'<soapenv:Body>' +
				'<ond:QASearch Localisation="" RequestTag="">' +
				this._buildSoapCountryString(country) +
				this._buildSoapEngineString({engineOptions, engineType}) +
				this._buildSoapLayoutString(layout) +
				this._buildSoapSearchString(addressQuery) +
				this._buildSoapFormatString(formattedAddressInPicklist) +
				'</ond:QASearch>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			return xmlString;
		};




		/* Private methods (shouldn't be called from the service directly) */

		/* @param {Object} engineOptions - a pure javascript object containing 6 key value pairs,
		 * associated with the possible engine parameters
		 *
		 * @returns {Object} - a new object that's similar to 'engineOptions', except there are no
		 * undefined values, and instead are replaced with empty strings.
		 */

		this._cleanEngineOptions = function({flatten, intensity, promptSet, threshold, timeout}) {

			/* We cannot use 'undefined' as a string, so we use a blank string, as an alternative  */
			return {
				flatten:   flatten   || true, /* TODO: Check if this is the right default */
				intensity: intensity || 'Close',
				promptSet: promptSet || 'Default',
				threshold: this._cleanThreshold(threshold),
				timeout:   this._cleanTimeout(timeout)
			}

		};

		/* @param {Number} threshold
		 * @returns {Number}
		 */
		this._cleanThreshold = function(threshold) {
			return threshold || 10000;
		};

		/* @param {Number} timeout
		 * @returns {Number}
		 */
		this._cleanTimeout = function(timeout) {
			return timeout || 10000;
		};

		/* @param {String} formatAddress
		 * @returns {String}
		 */
		this._buildSoapFormatString = function(formatAddress) {
			return '<ond:FormattedAddressInPicklist>' + formatAddress + '</ond:FormattedAddressInPicklist>';
		};


		/* @param {Object} object.engineOptions - contains an object that has the engine options (see #_cleanEngineOptions)
		 * @param {String} engineType
		 * @returns {String}
		 */
		this._buildSoapEngineString = function (object) {
			var engineOptions = object.engineOptions;
			var engineType    = object.engineType;

			var result = _cleanEngineOptions(engineOptions);

			var flatten   = result.flatten;
			var intensity = result.intensity;
			var promptSet = result.promptSet;
			var threshold = result.threshold;
			var timeout   = result.timeout;


			var engineSoapString =
				'<ond:Engine' + ' ' +
				'Flatten='   + '\'' + flatten   + '\' ' +
				'Intensity=' + '\'' + intensity + '\' ' +
				'PromptSet=' + '\'' + promptSet + '\' ' +
				'Threshold=' + '\'' + threshold + '\' ' +
				'Timeout='   + '\'' + timeout   + '\' ' +
				'>' + engineType + '</ond:Engine>';

			return engineSoapString;
		};


		this._buildSoapNamespaceSubString = function() {
			return 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
				'xmlns:ond="http://www.qas.com/OnDemand-2011-03"';
		};

		this._buildSoapMonikerString = function(moniker) {
			return '<ond:Moniker>' + moniker + '</ond:Moniker>';
		},

		this._buildSoapRefinementString = function(refinement) {
			return '<ond:Refinement>' + refinement + '</ond:Refinement>';
		};

		this._buildSoapLayoutString = function(layoutType = 'AllElements') {
			return '<ond:Layout>' + layoutType + '</ond:Layout>';
		};

		this._buildSoapSearchString = function(addressQuery) {
			return '<ond:Search>' + addressQuery + '</ond:Search>';
		};

		this._buildSoapCountryString = function(country) {
			return '<ond:Country>' + country + '</ond:Country>';
		};



	};

	EDQ.address = {

		/* ProWeb is an abstraction of our ProOnDemandService, which interoperates with the SOAP XML service in this case. */

		/* Expose the Public API */
		proWeb: {
			doCanSearch:           _proWebHelpers().doCanSearch,
			doGetAddress:          _proWebHelpers().doGetAddress,
			doGetData:             _proWebHelpers().doGetData,
			doGetDataMapDetail:    _proWebHelpers().doGetDataMapDetail,
			doGetExampleAddresses: _proWebHelpers().doGetExampleAddresses,
			doGetLayouts: 	       _proWebHelpers().doGetLayouts,
			doGetLicenseInfo:      _proWebHelpers().doSearch,
			doGetPromptSet:        _proWebHelpers().doSearch,
			doRefine: 	       _proWebHelpers().doRefine,
			doSearch: 	       _proWebHelpers().doSearch,
		},

	}

}).call(this);
