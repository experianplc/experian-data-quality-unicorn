/**
 * @module EDQ
 */
(function () {
    /* Configuration */
    /** Used to be granted authorization to make calls to the ProWebOnDemand webservice
     *
     * @name PRO_WEB_AUTH_TOKEN
     * @type {String}
     */
    /** Configuration file that can optionally be used, if configuration is external to this library.
     *  This approach is recommended.
     *
     *  @type {Object}
     */
    var EDQ_CONFIG = window.EdqConfig || {};
    var PRO_WEB_AUTH_TOKEN = EDQ_CONFIG.PRO_WEB_AUTH_TOKEN || '46832a16-80c0-43d8-af8e-05b3dde5aaaf';
    var PHONE_VALIDATE_PLUS_AUTH_TOKEN = EDQ_CONFIG.PHONE_VALIDATE_PLUS_AUTH_TOKEN || '1793360f-3d97-451a-81b8-d7e765c48894';
    var GLOBAL_PHONE_VALIDATE_AUTH_TOKEN = EDQ_CONFIG.GLOBAL_PHONE_VALIDATE_AUTH_TOKEN || '1793360f-3d97-451a-81b8-d7e765c48894';
    var EMAIL_VALIDATE_AUTH_TOKEN = EDQ_CONFIG.EMAIL_VALIDATE_AUTH_TOKEN || '1793360f-3d97-451a-81b8-d7e765c48894';
    var GLOBAL_INTUITIVE_AUTH_TOKEN = EDQ_CONFIG.GLOBAL_INTUITIVE_AUTH_TOKEN || '8c9faaa4-a5d2-4036-808d-11208a2e52d8';
    /** Service for ProWebOnDemand endpoint. Do not change unless you have a proxy to use
     *
     * @name PRO_WEB_SERVICE_URL
     * @type {String}
     */
    var PRO_WEB_SERVICE_URL = EDQ_CONFIG.PRO_WEB_SERVICE_URL || 'https://ws2.ondemand.qas.com/ProOnDemand/V3/ProOnDemandService.asmx';
    var PHONE_VALIDATE_PLUS_URL = 'https://api.experianmarketingservices.com/sync/queryresult/PhoneValidatePlus/1.0/';
    var GLOBAL_PHONE_VALIDATE_URL = 'https://api.experianmarketingservices.com/sync/queryresult/PhoneValidate/3.0/';
    var EMAIL_VALIDATE_URL = 'https://api.experianmarketingservices.com/sync/queryresult/EmailValidate/1.0/';
    var GLOBAL_INTUITIVE_URL = 'https://api.edq.com/capture/address/v2';
    /************************** end Configuration *********************************/
    var root = this;
    var previousEdq = root.EDQ;
    var EDQ = {};
    root.EDQ = EDQ;
    function _proWebHelpers() {
        var _this = this;
        /**
         * @param {String} country
         * @param {Object} engineOptions
         * @param {String} engineType
         * @param {String} layout
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doCanSearch = function (_a) {
            var country = _a.country, engineOptions = _a.engineOptions, engineType = _a.engineType, layout = _a.layout, callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoCanSearch';
            var xmlRequest = this.buildDoCanSearch({ country: country, engineOptions: engineOptions, engineType: engineType, layout: layout, callback: callback });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {String} layout
         * @param {String} moniker
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetAddress = function (_a) {
            var layout = _a.layout, moniker = _a.moniker, callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetAddress';
            var xmlRequest = this.buildDoGetAddressMessage({ layout: layout, moniker: moniker, callback: callback });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetData = function (_a) {
            var callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetData';
            var xmlRequest = this.buildDoGetDataMessage();
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {String} dataMap
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetDataMapDetail = function (_a) {
            var dataMap = _a.dataMap, callback = _a.callback;
            if (PRO_WEB_SERVICE_URL === 'https://ws2.ondemand.qas.com/ProOnDemand/V3/ProOnDemandService.asmx') {
                throw "This SOAP method is not supported in this version of QAS Pro On Demand";
            }
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetDataMapDetail';
            var xmlRequest = this.buildDoGetDataMapDetail({ dataMap: dataMap, callback: callback });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {String} country
         * @param {String} layout
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetExampleAddresses = function (_a) {
            var country = _a.country, layout = _a.layout, callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetExampleAddresses';
            var xmlRequest = this.buildDoGetExampleAddressesMessage({ country: country, layout: layout, callback: callback });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {String} country
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetLayouts = function (_a) {
            var country = _a.country, callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetLayouts';
            var xmlRequest = this.buildDoGetLayoutsMessage({ country: country, callback: callback });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetLicenseInfo = function (_a) {
            var callback = _a.callback;
            if (PRO_WEB_SERVICE_URL === 'https://ws2.ondemand.qas.com/ProOnDemand/V3/ProOnDemandService.asmx') {
                throw "This SOAP method is not supported in this version of QAS Pro On Demand";
            }
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetLicenseInfo';
            var xmlRequest = this.buildDoGetLicenseInfoMessage({ callback: callback });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {String} country
         * @param {Object} engineOptions
         * @param {String} engineType
         * @param {String} promptSet
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetPromptSet = function (_a) {
            var country = _a.country, engineOptions = _a.engineOptions, engineType = _a.engineType, promptSet = _a.promptSet, callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetPromptSet';
            var xmlRequest = this.buildDoGetPromptSetMessage({ country: country, engineOptions: engineOptions, engineType: engineType, promptSet: promptSet, callback: callback });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doGetSystemInfo = function (_a) {
            var callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetSystemInfo';
            var xmlRequest = this.buildDoGetSystemInfoMessage();
            this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
         * @param {String} refineOptions
         * @param {String} moniker
         * @param {String} refinement
         * @param {String} layout
         * @param {Boolean} formattedAddressInPicklist
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.doRefine = function (_a) {
            var refineOptions = _a.refineOptions, moniker = _a.moniker, refinement = _a.refinement, layout = _a.layout, formattedAddressInPicklist = _a.formattedAddressInPicklist, callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoRefine';
            var xmlRequest = this.buildDoRefineMessage({
                refineOptions: refineOptions,
                moniker: moniker,
                refinement: refinement,
                layout: layout,
                formattedAddressInPicklist: formattedAddressInPicklist,
                callback: callback
            });
            this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
     * @param {String} country
         * @param {String} engineOptions
         * @param {String} engineType
         * @param {String} layout
         * @param {String} addressQuery
         * @param {Boolean} formattedAddressInPicklist
     * @param {Function} callback
         *
     * @returns {XMLHttpRequest}
         */
        this.doSearch = function (_a) {
            var country = _a.country, engineOptions = _a.engineOptions, engineType = _a.engineType, layout = _a.layout, addressQuery = _a.addressQuery, formattedAddressInPicklist = _a.formattedAddressInPicklist, callback = _a.callback;
            var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoSearch';
            var xmlRequest = this.buildDoSearchMessage({
                country: country,
                engineOptions: engineOptions,
                engineType: engineType,
                layout: layout,
                addressQuery: addressQuery,
                formattedAddressInPicklist: formattedAddressInPicklist,
                callback: callback
            });
            return this.makeRequest(xmlRequest, soapActionUrl, callback);
        };
        /*
     * @param {String} country
         * @param {String} engineOptions
         * @param {String} engineType
         * @param {String} layout
         *
         * @returns {String}
         */
        this.buildDoCanSearch = function (_a) {
            var country = _a.country, engineOptions = _a.engineOptions, engineType = _a.engineType, layout = _a.layout;
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QASearch Localisation="" RequestTag="">' +
                this._buildSoapCountryString(country) +
                this._buildSoapEngineString({ engineOptions: engineOptions, engineType: engineType }) +
                this._buildSoapLayoutString(layout) +
                '</ond:QASearch>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
     * @param {String} layout
         * @param {String} moniker
         *
         * @returns {String}
         */
        this.buildDoGetAddressMessage = function (_a) {
            var layout = _a.layout, moniker = _a.moniker;
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QAGetAddress Localisation="" RequestTag="">' +
                this._buildSoapLayoutString(layout) +
                '<ond:Moniker>' + moniker + '</ond:Moniker>' +
                '</ond:QAGetAddress>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
     * @param {String} country
         * @param {String} layout
         *
         * @returns {String}
         */
        this.buildDoGetExampleAddressesMessage = function (_a) {
            var country = _a.country, layout = _a.layout;
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QAGetExampleAddresses Localisation="" RequestTag="">' +
                this._buildSoapCountryString(country) +
                this._buildSoapLayoutString(layout) +
                '</ond:QAGetExampleAddresses>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
         * @returns {String}
         */
        this.buildDoGetDataMessage = function () {
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QAGetData Localisation="" >' +
                '</ond:QAGetData>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
         * @param {String} dataMap
         *
         * @returns {String}
         */
        this.buildDoGetDataMapDetail = function (_a) {
            var dataMap = _a.dataMap;
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QAGetDataMapDetail Localisation="">' +
                this._buildSoapDataMapString(dataMap) +
                '</ond:QAGetDataMapDetail>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
         * @returns {String}
         */
        this.buildDoGetLicenseInfoMessage = function () {
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QAGetLicenseInfo Localisation=""/>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        },
            /*
             * @param {String} country
             *
             * @returns {String}
             */
            this.buildDoGetLayoutsMessage = function (_a) {
                var country = _a.country;
                var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                    '<soapenv:Body>' +
                    '<ond:QAGetLayouts Localisation="">' +
                    this._buildSoapCountryString(country) +
                    '</ond:QAGetLayouts>' +
                    '</soapenv:Body>' +
                    '</soapenv:Envelope>';
                return xmlString;
            };
        /*
         * @param {String} country
         * @param {Object} engineOptions
         * @param {String} engineType
         * @param {String} promptSet
         *
         * @returns {String}
         */
        this.buildDoGetPromptSetMessage = function (_a) {
            var country = _a.country, engineOptions = _a.engineOptions, engineType = _a.engineType, promptSet = _a.promptSet;
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QAGetPromptSet Localisation="">' +
                this._buildSoapCountryString(country) +
                this._buildSoapEngineString({ engineOptions: engineOptions, engineType: engineType }) +
                this._buildSoapPromptSetString(promptSet) +
                '</ond:QAGetPromptSet>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
         * @returns {String}
         */
        this.buildDoGetSystemInfoMessage = function () {
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QAGetSystemInfo Localisation=""/>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
         * @param {String} refineOptions
             * @param {String} moniker
             * @param {String} refineOptions
             * @param {String} layout
             * @param {Boolean} formattedAddressInPicklist
             *
             * @returns {String}
             */
        this.buildDoRefineMessage = function (_a) {
            var refineOptions = _a.refineOptions, moniker = _a.moniker, refinement = _a.refinement, layout = _a.layout, formattedAddressInPicklist = _a.formattedAddressInPicklist;
            var threshold = this._cleanThreshold(refineOptions.threshold);
            var timeout = this._cleanTimeout(refineOptions.timeout);
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QARefine Threshold=' + '\"' + threshold + '\"' + ' ' +
                'Timeout=' + '\"' + timeout + '\"' + ' ' +
                'Localisation=""' + ' ' +
                'RequestTag=""' +
                '>' +
                this._buildSoapMonikerString(moniker) +
                this._buildSoapRefinementString(refinement) +
                this._buildSoapLayoutString(layout) +
                this._buildSoapFormatString(formattedAddressInPicklist) +
                '</ond:QARefine>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
     * @param {String} country
         * @param {String} engineOptions
         * @param {String} engineType
         * @param {String} layout
         * @param {String} addressQuery
         * @param {Boolean} formattedAddressInPicklist
         *
         * @returns {String}
         */
        this.buildDoSearchMessage = function (_a) {
            var country = _a.country, engineOptions = _a.engineOptions, engineType = _a.engineType, layout = _a.layout, addressQuery = _a.addressQuery, formattedAddressInPicklist = _a.formattedAddressInPicklist;
            var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' +
                '<soapenv:Body>' +
                '<ond:QASearch Localisation="" RequestTag="">' +
                this._buildSoapCountryString(country) +
                this._buildSoapEngineString({ engineOptions: engineOptions, engineType: engineType }) +
                this._buildSoapLayoutString(layout) +
                this._buildSoapSearchString(addressQuery) +
                this._buildSoapFormatString(formattedAddressInPicklist) +
                '</ond:QASearch>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
            return xmlString;
        };
        /*
         * @param {String} requestData - a well formed XML string
         * @param {String} soapActionUrl - the SOAP endpoint where the data should be sent
         * @param {Function} callback - a callback that handles success or error.
         *
         * @returns {undefined}
         */
        this.makeRequest = (function (requestData, soapActionUrl, callback) {
            if (!PRO_WEB_SERVICE_URL) {
                throw 'Missing PRO_WEB_SERVICE_URL.';
            }
            else if (!PRO_WEB_AUTH_TOKEN) {
                throw 'Missing PRO_WEB_AUTH_TOKEN';
            }
            var xhr = new XMLHttpRequest();
            var self = _this;
            xhr.withCredentials = false;
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        callback(self._parseDOMChildren(this.responseXML), null);
                    }
                    else {
                        callback(null, {
                            status: 500,
                            statusText: 'Internal Server Error',
                            responseType: 'text',
                            response: 'Due to limitations in cross origin requests (CORS), the error frome the server could not be ' +
                                'referenced here. For more details about the error, resend this request from a client that is not an internet browser'
                        });
                    }
                }
            };
            xhr.open('POST', PRO_WEB_SERVICE_URL);
            xhr.setRequestHeader('Auth-Token', PRO_WEB_AUTH_TOKEN);
            xhr.setRequestHeader('SOAPAction', soapActionUrl);
            xhr.setRequestHeader('Content-Type', 'text/xml');
            xhr.send(requestData);
            return xhr;
        });
        /*** Private methods (shouldn't be called from the service directly) ***/
        /*
     * @param {Boolean} flatten
     * @param {String} intensity
     * @param {String} promptSet
     * @param {Number} threshold
     * @param {Number} timeout
     *
         * @returns {Object} - a new object that's similar to 'engineOptions', except there are no
         * undefined values, and instead are replaced with empty strings.
         */
        this._cleanEngineOptions = function (_a) {
            var flatten = _a.flatten, intensity = _a.intensity, promptSet = _a.promptSet, threshold = _a.threshold, timeout = _a.timeout;
            return {
                flatten: flatten || true,
                intensity: intensity || 'Close',
                promptSet: promptSet || 'Default',
                threshold: this._cleanThreshold(threshold),
                timeout: this._cleanTimeout(timeout)
            };
        };
        /*
     * @param {Number} threshold
     *
         * @returns {Number}
         */
        this._cleanThreshold = function (threshold) {
            return threshold || 10000;
        };
        /*
     * @param {Number} timeout
     *
         * @returns {Number}
         */
        this._cleanTimeout = function (timeout) {
            return timeout || 10000;
        };
        /*
     * @param {String} formatAddress
     *
         * @returns {String}
         */
        this._buildSoapFormatString = function (formatAddress) {
            return '<ond:FormattedAddressInPicklist>' + formatAddress + '</ond:FormattedAddressInPicklist>';
        };
        /*
     * @param {Object} object.engineOptions - contains an object that has the engine options (see #_cleanEngineOptions)
         * @param {String} engineType
     *
         * @returns {String}
         */
        this._buildSoapEngineString = function (object) {
            var engineOptions = object.engineOptions;
            var engineType = object.engineType;
            var result = this._cleanEngineOptions(engineOptions);
            var flatten = result.flatten;
            var intensity = result.intensity;
            var promptSet = result.promptSet;
            var threshold = result.threshold;
            var timeout = result.timeout;
            var engineSoapString = '<ond:Engine' + ' ' +
                'Flatten=' + '\'' + flatten + '\' ' +
                'Intensity=' + '\'' + intensity + '\' ' +
                'PromptSet=' + '\'' + promptSet + '\' ' +
                'Threshold=' + '\'' + threshold + '\' ' +
                'Timeout=' + '\'' + timeout + '\' ' +
                '>' + engineType + '</ond:Engine>';
            return engineSoapString;
        };
        /*
     * @returns {String}
     */
        this._buildSoapNamespaceSubString = function () {
            return 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
                'xmlns:ond="http://www.qas.com/OnDemand-2011-03"';
        };
        /*
     * @param {String} moniker
     *
         * @returns {String}
         */
        this._buildSoapMonikerString = function (moniker) {
            return '<ond:Moniker>' + moniker + '</ond:Moniker>';
        },
            /*
         * @param {String} refinement
         *
             * @returns {String}
             */
            this._buildSoapRefinementString = function (refinement) {
                return '<ond:Refinement>' + refinement + '</ond:Refinement>';
            };
        /*
     * @param {String} layoutType
     *
         * @returns {String}
         */
        this._buildSoapLayoutString = function (layoutType) {
            if (layoutType === void 0) { layoutType = 'AllElements'; }
            return '<ond:Layout>' + layoutType + '</ond:Layout>';
        };
        /* @param {String} addressQuery
     *
         * @returns {String}
         */
        this._buildSoapSearchString = function (addressQuery) {
            return '<ond:Search>' + addressQuery + '</ond:Search>';
        };
        /* @param {String} promptSet
     *
         * @returns {String}
         */
        this._buildSoapPromptSetString = function (promptSet) {
            return '<ond:PromptSet>' + promptSet + '</ond:PromptSet>';
        };
        /* @param {String} country
     *
         * @returns {String}
         */
        this._buildSoapCountryString = function (country) {
            return '<ond:Country>' + country + '</ond:Country>';
        };
        /*
         * @param {String} dataMap
         *
         * @returns {String}
         */
        this._buildSoapDataMapString = function (dataMap) {
            return '<ond:DataMap>' + dataMap + '</ond:DataMap>';
        };
        /*** Taken from X2JS ***/
        /**
         * @param {any}
         * @param {any}
         * @param {ConfigObject}
         */
        this._parseDOMChildren = function (node, path, config) {
            if (config === void 0) { config = {}; }
            config = initConfigDefaults(config);
            /**
             * @returns {ConfigObject}
             */
            function initConfigDefaults(config) {
                return {
                    escapeMode: config.escapeMode || true,
                    attributePrefix: config.attributePrefix || "_",
                    arrayAccessForm: config.arrayAccessForm || "none",
                    emptyNodeForm: config.emptyNodeForm || "text",
                    enableToStringFunc: config.enableToStringFunc || true,
                    arrayAccessFormPaths: config.arrayAccessFormPaths || [],
                    skipEmptyTextNodesForObj: config.skipEmptyTextNodesForObj || true,
                    stripWhitespaces: config.stripWhitespaces || true,
                    datetimeAccessFormPaths: config.datetimeAccessFormPaths || [],
                    useDoubleQuotes: config.useDoubleQuotes || false,
                    xmlElementsFilter: config.xmlElementsFilter || [],
                    jsonPropertiesFilter: config.jsonPropertiesFilter || [],
                    keepCData: config.keepCData || false
                };
            }
            var DOMNodeTypes = {
                ELEMENT_NODE: 1,
                TEXT_NODE: 3,
                CDATA_SECTION_NODE: 4,
                COMMENT_NODE: 8,
                DOCUMENT_NODE: 9
            };
            function getNodeLocalName(node) {
                var nodeLocalName = node.localName;
                if (nodeLocalName == null)
                    nodeLocalName = node.baseName;
                if (nodeLocalName == null || nodeLocalName == "")
                    nodeLocalName = node.nodeName;
                return nodeLocalName;
            }
            function getNodePrefix(node) {
                return node.prefix;
            }
            function escapeXmlChars(str) {
                if (typeof (str) == "string")
                    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                else
                    return str;
            }
            function unescapeXmlChars(str) {
                return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
            }
            function checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
                var idx = 0;
                for (; idx < stdFiltersArrayForm.length; idx++) {
                    var filterPath = stdFiltersArrayForm[idx];
                    if (typeof filterPath === "string") {
                        if (filterPath == path)
                            break;
                    }
                    else if (filterPath instanceof RegExp) {
                        if (filterPath.test(path))
                            break;
                    }
                    else if (typeof filterPath === "function") {
                        if (filterPath(obj, name, path))
                            break;
                    }
                }
                return idx != stdFiltersArrayForm.length;
            }
            function toArrayAccessForm(obj, childName, path) {
                switch (config.arrayAccessForm) {
                    case "property":
                        if (!(obj[childName] instanceof Array))
                            obj[childName + "_asArray"] = [obj[childName]];
                        else
                            obj[childName + "_asArray"] = obj[childName];
                        break;
                }
                if (!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
                    if (checkInStdFiltersArrayForm(config.arrayAccessFormPaths, obj, childName, path)) {
                        obj[childName] = [obj[childName]];
                    }
                }
            }
            function fromXmlDateTime(prop) {
                // Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
                // Improved to support full spec and optional parts
                var bits = prop.split(/[-T:+Z]/g);
                var d = new Date(bits[0], bits[1] - 1, bits[2]);
                var secondBits = bits[5].split("\.");
                d.setHours(bits[3], bits[4], secondBits[0]);
                if (secondBits.length > 1)
                    d.setMilliseconds(secondBits[1]);
                // Get supplied time zone offset in minutes
                if (bits[6] && bits[7]) {
                    var offsetMinutes = bits[6] * 60 + Number(bits[7]);
                    var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';
                    // Apply the sign
                    offsetMinutes = 0 + (sign == '-' ? -1 * offsetMinutes : offsetMinutes);
                    // Apply offset and local timezone
                    d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
                }
                else if (prop.indexOf("Z", prop.length - 1) !== -1) {
                    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
                }
                // d is now a local time equivalent to the supplied time
                return d;
            }
            function checkFromXmlDateTimePaths(value, childName, fullPath) {
                if (config.datetimeAccessFormPaths.length > 0) {
                    var path = fullPath.split("\.#")[0];
                    if (checkInStdFiltersArrayForm(config.datetimeAccessFormPaths, value, childName, path)) {
                        return fromXmlDateTime(value);
                    }
                    else
                        return value;
                }
                else
                    return value;
            }
            function checkXmlElementsFilter(obj, childType, childName, childPath) {
                if (childType == DOMNodeTypes.ELEMENT_NODE && config.xmlElementsFilter.length > 0) {
                    return checkInStdFiltersArrayForm(config.xmlElementsFilter, obj, childName, childPath);
                }
                else
                    return true;
            }
            if (node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
                var result = {};
                var nodeChildren = node.childNodes;
                // Alternative for firstElementChild which is not supported in some environments
                for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
                    var child = nodeChildren.item(cidx);
                    if (child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                        var childName = getNodeLocalName(child);
                        result[childName] = this._parseDOMChildren(child, childName);
                    }
                }
                return result;
            }
            else if (node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                var result = {};
                result.__cnt = 0;
                var nodeChildren = node.childNodes;
                // Children nodes
                for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
                    var child = nodeChildren.item(cidx); // nodeChildren[cidx];
                    var childName = getNodeLocalName(child);
                    if (child.nodeType != DOMNodeTypes.COMMENT_NODE) {
                        var childPath = path + "." + childName;
                        if (checkXmlElementsFilter(result, child.nodeType, childName, childPath)) {
                            result.__cnt++;
                            if (result[childName] == null) {
                                result[childName] = this._parseDOMChildren(child, childPath);
                                toArrayAccessForm(result, childName, childPath);
                            }
                            else {
                                if (result[childName] != null) {
                                    if (!(result[childName] instanceof Array)) {
                                        result[childName] = [result[childName]];
                                        toArrayAccessForm(result, childName, childPath);
                                    }
                                }
                                (result[childName])[result[childName].length] = this._parseDOMChildren(child, childPath);
                            }
                        }
                    }
                }
                for (var aidx = 0; aidx < node.attributes.length; aidx++) {
                    var attr = node.attributes.item(aidx);
                    result.__cnt++;
                    result[config.attributePrefix + attr.name] = attr.value;
                }
                var nodePrefix = getNodePrefix(node);
                if (nodePrefix != null && nodePrefix != "") {
                    result.__cnt++;
                    result.__prefix = nodePrefix;
                }
                if (result["#text"] != null) {
                    result.__text = result["#text"];
                    if (result.__text instanceof Array) {
                        result.__text = result.__text.join("\n");
                    }
                    if (config.stripWhitespaces)
                        result.__text = result.__text.trim();
                    delete result["#text"];
                    if (config.arrayAccessForm == "property")
                        delete result["#text_asArray"];
                    result.__text = checkFromXmlDateTimePaths(result.__text, childName, path + "." + childName);
                }
                if (result["#cdata-section"] != null) {
                    result.__cdata = result["#cdata-section"];
                    delete result["#cdata-section"];
                    if (config.arrayAccessForm == "property")
                        delete result["#cdata-section_asArray"];
                }
                if (result.__cnt == 0 && config.emptyNodeForm == "text") {
                    result = '';
                }
                else if (result.__cnt == 1 && result.__text != null) {
                    result = result.__text;
                }
                else if (result.__cnt == 1 && result.__cdata != null && !config.keepCData) {
                    result = result.__cdata;
                }
                else if (result.__cnt > 1 && result.__text != null && config.skipEmptyTextNodesForObj) {
                    if ((config.stripWhitespaces && result.__text == "") || (result.__text.trim() == "")) {
                        delete result.__text;
                    }
                }
                delete result.__cnt;
                if (config.enableToStringFunc && (result.__text != null || result.__cdata != null)) {
                    result.toString = function () {
                        return (this.__text != null ? this.__text : '') + (this.__cdata != null ? this.__cdata : '');
                    };
                }
                return result;
            }
            else if (node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
                return node.nodeValue;
            }
        };
    }
    ;
    function _globalIntuitiveHelpers() {
        var _this = this;
        /*
         * @param {String} query
         * @param {String} country
         * @param {Number} take
         * @param {Boolean} verbose
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.search = (function (_a) {
            var query = _a.query, country = _a.country, _b = _a.take, take = _b === void 0 ? 7 : _b, callback = _a.callback;
            if (!GLOBAL_INTUITIVE_URL) {
                throw 'Missing GLOBAL_INTUITIVE_URL.';
            }
            else if (!GLOBAL_INTUITIVE_AUTH_TOKEN) {
                throw 'Missing GLOBAL_INTUITIVE_AUTH_TOKEN';
            }
            var data = "?query=" + query + "&country=" + country + "&take=" + take + "&auth-token=" + GLOBAL_INTUITIVE_AUTH_TOKEN;
            return _this.makeRequest(data, GLOBAL_INTUITIVE_URL + "/Search", callback);
        });
        /*
         * @param {String} formatUrl
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.format = (function (_a) {
            var formatUrl = _a.formatUrl, callback = _a.callback;
            if (!GLOBAL_INTUITIVE_URL) {
                throw 'Missing GLOBAL_INTUITIVE_URL.';
            }
            else if (!GLOBAL_INTUITIVE_AUTH_TOKEN) {
                throw 'Missing GLOBAL_INTUITIVE_AUTH_TOKEN';
            }
            var data = "&auth-token=" + GLOBAL_INTUITIVE_AUTH_TOKEN;
            return _this.makeRequest(data, formatUrl, callback);
        });
        /*
         * @param {String} addressId
         * @param {String} country
         * @param {Number} take
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.formatById = (function (_a) {
            var addressId = _a.addressId, country = _a.country, _b = _a.take, take = _b === void 0 ? 7 : _b, callback = _a.callback;
            if (!GLOBAL_INTUITIVE_URL) {
                throw 'Missing GLOBAL_INTUITIVE_URL.';
            }
            else if (!GLOBAL_INTUITIVE_AUTH_TOKEN) {
                throw 'Missing GLOBAL_INTUITIVE_AUTH_TOKEN';
            }
            var data = "?id=" + addressId + "&country=" + country + "&take=" + take + "&auth-token=" + GLOBAL_INTUITIVE_AUTH_TOKEN;
            return _this.makeRequest(data, GLOBAL_INTUITIVE_AUTH_TOKEN + "/Format", callback);
        });
        /*
         * @param {Object} data
         * @param {String} url
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.makeRequest = (function (data, url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        callback(JSON.parse(this.response), null);
                    }
                    else {
                        callback(null, {
                            status: this.status,
                            statusText: this.statusText
                        });
                    }
                }
            };
            xhr.open('GET', "" + url + data);
            xhr.send();
            return xhr;
        });
    }
    function _emailValidateHelper() {
        var _this = this;
        /*
         * @param {String} emailAddress
         * @param {Number} timeout
         * @param {Boolean} verbose
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.emailValidate = (function (_a) {
            var emailAddress = _a.emailAddress, _b = _a.timeout, timeout = _b === void 0 ? 15 : _b, _c = _a.verbose, verbose = _c === void 0 ? true : _c, callback = _a.callback;
            if (!EMAIL_VALIDATE_URL) {
                throw 'Missing EMAIL_VALIDATE_URL.';
            }
            else if (!EMAIL_VALIDATE_AUTH_TOKEN) {
                throw 'Missing EMAIL_VALIDATE_AUTH_TOKEN';
            }
            return _this.makeRequest(emailAddress, timeout, verbose, callback);
        });
        /*
         * @param {String} emailAddress
         * @param {Number} timeout
         * @param {Boolean} verbose
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.makeRequest = (function (emailAddress, timeout, verbose, callback) {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        callback(JSON.parse(this.response), null);
                    }
                    else {
                        callback(null, {
                            status: this.status,
                            statusText: this.statusText
                        });
                    }
                }
            };
            xhr.open('POST', EMAIL_VALIDATE_URL);
            xhr.setRequestHeader('Auth-Token', EMAIL_VALIDATE_AUTH_TOKEN);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                email: emailAddress,
                timeout: timeout,
                verbose: verbose
            }));
            return xhr;
        });
    }
    function _phoneValidateHelper(type) {
        var _this = this;
        this.validationType = type;
        /*
         * @param {String} phoneNumber
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.reversePhoneAppend = (function (_a) {
            var phoneNumber = _a.phoneNumber, callback = _a.callback;
            if (!PHONE_VALIDATE_PLUS_URL) {
                throw 'Missing PRO_WEB_SERVICE_URL.';
            }
            else if (!PHONE_VALIDATE_PLUS_AUTH_TOKEN) {
                throw 'Missing PRO_WEB_AUTH_TOKEN';
            }
            return _this.makeRequest(phoneNumber, callback);
        });
        /*
         * @param {String} phoneNumber
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.globalPhoneValidate = (function (_a) {
            var phoneNumber = _a.phoneNumber, callback = _a.callback;
            if (!GLOBAL_PHONE_VALIDATE_URL) {
                throw 'Missing PRO_WEB_SERVICE_URL.';
            }
            else if (!GLOBAL_PHONE_VALIDATE_AUTH_TOKEN) {
                throw 'Missing PRO_WEB_AUTH_TOKEN';
            }
            return _this.makeRequest(phoneNumber, callback);
        });
        /*
         * @param {String} phoneNumber
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        this.makeRequest = (function (phoneNumber, callback) {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        callback(JSON.parse(this.response), null);
                    }
                    else {
                        callback(null, {
                            status: this.status,
                            statusText: this.statusText
                        });
                    }
                }
            };
            switch (_this.validationType) {
                case 'reversePhoneAppend':
                    xhr.open('POST', PHONE_VALIDATE_PLUS_URL);
                    xhr.setRequestHeader('Auth-Token', PHONE_VALIDATE_PLUS_AUTH_TOKEN);
                    break;
                case 'globalPhone':
                    xhr.open('POST', GLOBAL_PHONE_VALIDATE_URL);
                    xhr.setRequestHeader('Auth-Token', GLOBAL_PHONE_VALIDATE_AUTH_TOKEN);
                    break;
            }
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                'Number': phoneNumber
            }));
            return xhr;
        });
    }
    ;
    var proWebHelper = new _proWebHelpers();
    var reversePhoneValidateHelper = new _phoneValidateHelper('reversePhoneAppend');
    var globalPhoneValidateHelper = new _phoneValidateHelper('globalPhone');
    var emailValidateHelper = new _emailValidateHelper();
    var globalIntuitiveHelper = new _globalIntuitiveHelpers();
    EDQ.email = {
        /**
         * This module is a wrapper around the REST calls for Email Validateion
         * Additional documentation for the REST calls can be found here:
         *
         * <br><br> {@link https://www.edq.com/documentation/apis/}
         *
         * @module Email Validate
         */
        /**
         * Validates an email address
         *
         * @param {String} emailAddress
         * @param {Number} timeout
         * @param {Boolean} verbose
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        emailValidate: emailValidateHelper.emailValidate.bind(emailValidateHelper)
    };
    EDQ.phone = {
        /**
         * This module is a wrapper around the REST calls for PhoneValidatePlus (Reverse Phone Append)
         * Additional documentation for the REST calls can be found here:
         *
         * <br><br> {@link https://www.edq.com/documentation/apis/}
         *
         * @module Reverse Phone Append
         */
        /**
         * Validates a phone number, and returns any user information, if available
         *
         * @param {String} phoneNumber
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        reversePhoneAppend: reversePhoneValidateHelper.reversePhoneAppend.bind(reversePhoneValidateHelper),
        /**
         * This module is a wrapper around the REST calls for PhoneValidate (Global Phone Validate)
         * Additional documentation for the REST calls can be found here:
         *
         * <br><br> {@link https://www.edq.com/documentation/apis/}
         *
         * @module Global Phone Validate
         */
        /**
         * Validates a phone number
         *
         * @param {String} phoneNumber
         * @param {Function} callback
         *
         * @returns {XMLHttpRequest}
         */
        globalPhoneValidate: globalPhoneValidateHelper.globalPhoneValidate.bind(globalPhoneValidateHelper)
    };
    EDQ.address = {
        /**
         * This module is a wrapper around the JSON Global Intuitive calls
         * Additional documentation for the SOAP calls can be found here:
         *
         * <br><br> {@link https://www.edq.com/documentation/apis/address-validate/address-validate-soap/}
         *
         * @module ProWeb
         */
        globalIntuitive: {
            /** Returns a collection of suggested addresses based on the search query and country
             *
             * @param {String} query
             * @param {String} country - ISO-3 country code
             * @param {Number} take - the amount of results to be returned
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            search: globalIntuitiveHelper.search.bind(globalIntuitiveHelper),
            /** Returns the full address and component breakdown for the chosen address
             *
             * @param {String} formatUrl
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            format: globalIntuitiveHelper.format.bind(globalIntuitiveHelper),
            /** Returns the full address and component breakdown for the chosen address
             *
             * @param {String} addressId - address id from #search
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            formatById: globalIntuitiveHelper.formatById.bind(globalIntuitiveHelper),
        },
        /**
         * This module is a wrapper around the SOAP XML calls for ProWebOnDemand.
         * Additional documentation for the SOAP calls can be found here:
         *
         * <br><br> {@link https://www.edq.com/documentation/apis/address-validate/address-validate-soap/}
         *
         * @module ProWeb
         */
        proWeb: {
            /**
             * Checks that the combination of data mapping, engine and layout are valid for searching.
             *
             * @name DoCanSearch
             * @function
             *
             * @param {String} country
             * @param {Object} engineOptions
             * @param {String} engineType
             * @param {String} layout
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doCanSearch: proWebHelper.doCanSearch.bind(proWebHelper),
            /**
             * Formats a picklist item to obtain a final, formatted address.
             *
             * @name DoGetAddress
             * @function
             *
             * @param {String} layout
             * @param {String} moniker
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetAddress: proWebHelper.doGetAddress.bind(proWebHelper),
            /**
             * Obtains a list of available data mappings
             *
             * @name DoGetData
             * @function
             *
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetData: proWebHelper.doGetData.bind(proWebHelper),
            /**
             * NOTE: This does not function on the latest version of ProWeb
             *
             * @name DoGetDataMapDetail
             * @function
             *
             * @param {String} dataMap
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetDataMapDetail: proWebHelper.doGetDataMapDetail.bind(proWebHelper),
            /**
             * Returns fully formatted example addresses
             *
             * @name DoGetExampleAddresses
             * @function
             *
             * @param {String} country
             * @param {String} layout
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetExampleAddresses: proWebHelper.doGetExampleAddresses.bind(proWebHelper),
            /**
             * Obtains a list of layouts that have been configured within the configuration file.
             *
             * @name DoGetLayouts
             * @function
             *
             * @param {String} country
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetLayouts: proWebHelper.doGetLayouts.bind(proWebHelper),
            /**
             * Returns license information for ProWebOnDemand.
             *
             * @name DoGetLicenseInfo
             * @function
             *
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetLicenseInfo: proWebHelper.doGetLicenseInfo.bind(proWebHelper),
            /**
             * Returns prompt set information.
             *
             * @name DoGetPromptSet
             * @function
             *
             * @param {String} country
             * @param {Object} engineOptions
             * @param {String} engineType
             * @param {String} promptSet
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetPromptSet: proWebHelper.doGetPromptSet.bind(proWebHelper),
            /**
             * Returns information about the server
             *
             * @name DoGetSystemInfo
             * @function
             *
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doGetSystemInfo: proWebHelper.doGetSystemInfo.bind(proWebHelper),
            /**
             * Used to step into and refine a picklist result
             *
             * @name DoRefine
             * @function
             *
             * @param {String} refineOptions
             * @param {String} moniker
             * @param {String} refinement
             * @param {String} layout
             * @param {Boolean} formattedAddressInPicklist
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doRefine: proWebHelper.doRefine.bind(proWebHelper),
            /**
             * Submits an initial search to the server
             *
             * @name DoSearch
             * @function
             *
             * @param {String} country
             * @param {String} engineOptions
             * @param {String} engineType
             * @param {String} layout
             * @param {String} addressQuery
             * @param {Boolean} formattedAddressInPicklist
             * @param {Function} callback
             *
             * @returns {XMLHttpRequest}
             */
            doSearch: proWebHelper.doSearch.bind(proWebHelper),
        },
    };
}).call(this);
