/* The EDQ library */

(function () {
  var root = this;
  var previousEdq = root.EDQ;

  /* Creates a reference to the EDQ object
   *
   * @param {Object} object
   * @returns undefined
   */
  var EDQ = function EDQ(object) {
    if (object instanceof EDQ) return object;
    if (!(this instanceof EDQ)) return new EDQ();
    this._wrapped = object;
  };

  EDQ.VERSION = '0.1';

  /* TODO: This needs to read from an environment variable of configuration file */
  AUTH_TOKEN = '46832a16-80c0-43d8-af8e-05b3dde5aaaf';
  PRO_WEB_SERVICE_URL = 'https://ws2.ondemand.qas.com/ProOnDemand/V3/ProOnDemandService.asmx';

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = EDQ;
    }

    exports.EDQ = EDQ;
  } else {
    root.EDQ = EDQ;
  }

  function _proWebHelpers() {
    var _this = this;

    this.doCanSearch = function () {
      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoCanSearch';
      var xmlRequest = this.buildDoRefineMessage.apply(this, arguments);
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    /*
     * @param {String} layout
     * @param {String} moniker
     * @param {Function} callback
     *
     * @returns {String}
     */
    this.doGetAddress = function (_ref) {
      var layout = _ref.layout,
          moniker = _ref.moniker,
          callback = _ref.callback;

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetAddress';
      var xmlRequest = this.buildDoGetAddressMessage.apply(this, arguments);
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    /*
     * @param {Function} callback
     *
     * @returns {undefined}
     */
    this.doGetData = function (_ref2) {
      var callback = _ref2.callback;

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetData';
      var xmlRequest = this.buildDoGetDataMessage();
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    /*
     * @param {String} dataMap
     * @param {Function} callback
     *
     * @returns {String}
     */
    this.doGetDataMapDetail = function (_ref3) {
      var dataMap = _ref3.dataMap,
          callback = _ref3.callback;

      if (PRO_WEB_SERVICE_URL === 'https://ws2.ondemand.qas.com/ProOnDemand/V3/ProOnDemandService.asmx') {
        throw "This SOAP method is not supported in this version of QAS Pro On Demand";
      }

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetDataMapDetail';
      var xmlRequest = this.buildDoGetDataMapDetail.apply(this, arguments);
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    /*
     * @param {String} country
     * @param {String} layout
     * @param {Function} callback
     *
     * @returns {String}
     */
    this.doGetExampleAddresses = function (_ref4) {
      var country = _ref4.country,
          layout = _ref4.layout,
          callback = _ref4.callback;

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetExampleAddresses';
      var xmlRequest = this.buildDoGetExampleAddressesMessage.apply(this, arguments);
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    /*
     * @param {String} country
     * @param {Function} callback
     *
     * @returns {String}
     */
    this.doGetLayouts = function (_ref5) {
      var country = _ref5.country,
          callback = _ref5.callback;

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetLayouts';
      var xmlRequest = this.buildDoGetLayoutsMessage.apply(this, arguments);
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    /*
     * @param {Function} callback
     */
    this.doGetLicenseInfo = function (_ref6) {
      var callback = _ref6.callback;

      if (PRO_WEB_SERVICE_URL === 'https://ws2.ondemand.qas.com/ProOnDemand/V3/ProOnDemandService.asmx') {
        throw "This SOAP method is not supported in this version of QAS Pro On Demand";
      }

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetLicenseInfo';
      var xmlRequest = this.buildDoGetLicenseInfoMessage.apply(this, arguments);
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
    this.doGetPromptSet = function (_ref7) {
      var country = _ref7.country,
          engineOptions = _ref7.engineOptions,
          engineType = _ref7.engineType,
          promptSet = _ref7.promptSet,
          callback = _ref7.callback;

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoGetPromptSet';
      var xmlRequest = this.buildDoGetPromptSetMessage.apply(this, arguments);
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    /*
     * @param {Function} callback
     *
     * @returns {undefined}
     */
    this.doGetSystemInfo = function (_ref8) {
      var callback = _ref8.callback;

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
     * @returns {undefined}
     */
    this.doRefine = function (_ref9) {
      var refineOptions = _ref9.refineOptions,
          moniker = _ref9.moniker,
          refinement = _ref9.refinement,
          layout = _ref9.layout,
          formattedAddressInPicklist = _ref9.formattedAddressInPicklist,
          callback = _ref9.callback;

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoRefine';
      var xmlRequest = this.buildDoRefineMessage.apply(this, arguments);
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
     * @returns {String}
     */
    this.doSearch = function (_ref10) {
      var country = _ref10.country,
          engineOptions = _ref10.engineOptions,
          engineType = _ref10.engineType,
          layout = _ref10.layout,
          addressQuery = _ref10.addressQuery,
          formattedAddressInPicklist = _ref10.formattedAddressInPicklist,
          callback = _ref10.callback;

      var soapActionUrl = 'http://www.qas.com/OnDemand-2011-03/DoSearch';
      var xmlRequest = this.buildDoSearchMessage.apply(this, arguments);
      return this.makeRequest(xmlRequest, soapActionUrl, callback);
    };

    this.buildDoGetExampleAddressesMessage = function (_ref11) {
      var country = _ref11.country,
          layout = _ref11.layout;

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetExampleAddresses Localisation="" RequestTag="">' + this._buildSoapCountryString(country) + this._buildSoapLayoutString(layout) + '</ond:QAGetExampleAddresses>' + '</soapenv:Body>' + '</soapenv:Envelope>';

      return xmlString;
    };

    this.buildDoGetDataMessage = function () {
      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetData Localisation="" >' + '</ond:QAGetData>' + '</soapenv:Body>' + '</soapenv:Envelope>';

      return xmlString;
    };

    this.buildDoGetAddressMessage = function (_ref12) {
      var layout = _ref12.layout,
          moniker = _ref12.moniker;

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetAddress Localisation="" RequestTag="">' + this._buildSoapLayoutString(layout) + '<ond:Moniker>' + moniker + '</ond:Moniker>' + '</ond:QAGetAddress>' + '</soapenv:Body>' + '</soapenv:Envelope>';

      return xmlString;
    };

    /*
     * @param {String} dataMap
     *
     * @returns {String}
     */
    this.buildDoGetDataMapDetail = function (_ref13) {
      var dataMap = _ref13.dataMap;

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetDataMapDetail Localisation="">' + this._buildSoapDataMapString(dataMap) + '</ond:QAGetDataMapDetail>' + '</soapenv:Body>' + '</soapenv:Envelope>';

      return xmlString;
    };

    /*
     * @returns {String}
     */
    this.buildDoGetLicenseInfoMessage = function () {
      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetLicenseInfo Localisation=""/>' + '</soapenv:Body>' + '</soapenv:Envelope>';

      return xmlString;
    },

    /*
     * @param {String} country
     *
     * @returns {String}
     */
    this.buildDoGetLayoutsMessage = function (_ref14) {
      var country = _ref14.country;

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetLayouts Localisation="">' + this._buildSoapCountryString(country) + '</ond:QAGetLayouts>' + '</soapenv:Body>' + '</soapenv:Envelope>';

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
    this.buildDoGetPromptSetMessage = function (_ref15) {
      var country = _ref15.country,
          engineOptions = _ref15.engineOptions,
          engineType = _ref15.engineType,
          promptSet = _ref15.promptSet;

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetPromptSet Localisation="">' + this._buildSoapCountryString(country) + this._buildSoapEngineString({ engineOptions: engineOptions, engineType: engineType }) + this._buildSoapPromptSetString(promptSet) + '</ond:QAGetPromptSet>' + '</soapenv:Body>' + '</soapenv:Envelope>';

      return xmlString;
    };

    /*
     * @returns {String}
     */
    this.buildDoGetSystemInfoMessage = function () {

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QAGetSystemInfo Localisation=""/>' + '</soapenv:Body>' + '</soapenv:Envelope>';

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
    this.buildDoRefineMessage = function (_ref16) {
      var refineOptions = _ref16.refineOptions,
          moniker = _ref16.moniker,
          refinement = _ref16.refinement,
          layout = _ref16.layout,
          formattedAddressInPicklist = _ref16.formattedAddressInPicklist;

      var threshold = this._cleanThreshold(refineOptions.threshold);
      var timeout = this._cleanTimeout(refineOptions.timeout);

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QARefine Threshold=' + '\"' + threshold + '\"' + ' ' + 'Timeout=' + '\"' + timeout + '\"' + ' ' + 'Localisation=""' + ' ' + 'RequestTag=""' + '>' + this._buildSoapMonikerString(moniker) + this._buildSoapRefinementString(refinement) + this._buildSoapLayoutString(layout) + this._buildSoapFormatString(formattedAddressInPicklist) + '</ond:QARefine>' + '</soapenv:Body>' + '</soapenv:Envelope>';

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
    this.buildDoSearchMessage = function (_ref17) {
      var country = _ref17.country,
          engineOptions = _ref17.engineOptions,
          engineType = _ref17.engineType,
          layout = _ref17.layout,
          addressQuery = _ref17.addressQuery,
          formattedAddressInPicklist = _ref17.formattedAddressInPicklist;

      var xmlString = '<soapenv:Envelope ' + this._buildSoapNamespaceSubString() + '>' + '<soapenv:Body>' + '<ond:QASearch Localisation="" RequestTag="">' + this._buildSoapCountryString(country) + this._buildSoapEngineString({ engineOptions: engineOptions, engineType: engineType }) + this._buildSoapLayoutString(layout) + this._buildSoapSearchString(addressQuery) + this._buildSoapFormatString(formattedAddressInPicklist) + '</ond:QASearch>' + '</soapenv:Body>' + '</soapenv:Envelope>';

      return xmlString;
    };

    /*
     * @param {String} requestData - a well formed XML string
     * @param {String} soapActionUrl - the SOAP endpoint where the data should be sent
     * @param {Function} callback - a callback that handles success or error.
     *
     * @returns {undefined}
     */
    this.makeRequest = function (requestData, soapActionUrl, callback) {
      var xhr = new XMLHttpRequest();
      var self = _this;

      xhr.withCredentials = false;
      xhr.onreadystatechange = function () {
        if (this.readyState === 4) {

          if (this.status === 200) {
            callback(self._parseDOMChildren(this.responseXML), null);
          } else {
            callback(null, {
              status: 500,
              statusText: 'Internal Server Error',
              responseType: 'text',
              response: 'Due to limitations in cross origin requests (CORS), the error frome the server could not be ' + 'referenced here. For more details about the error, resend this request from a client that is not an internet browser'
            });
          }
        }
      };

      xhr.open('POST', PRO_WEB_SERVICE_URL);
      xhr.setRequestHeader('Auth-Token', AUTH_TOKEN);
      xhr.setRequestHeader('SOAPAction', soapActionUrl);
      xhr.setRequestHeader('Content-Type', 'text/xml');
      xhr.send(requestData);
    };

    /* Private methods (shouldn't be called from the service directly) */

    /* @param {Object} engineOptions - a pure javascript object containing 6 key value pairs,
     * associated with the possible engine parameters
     *
     * @returns {Object} - a new object that's similar to 'engineOptions', except there are no
     * undefined values, and instead are replaced with empty strings.
     */

    this._cleanEngineOptions = function (_ref18) {
      var flatten = _ref18.flatten,
          intensity = _ref18.intensity,
          promptSet = _ref18.promptSet,
          threshold = _ref18.threshold,
          timeout = _ref18.timeout;


      /* We cannot use 'undefined' as a string, so we use a blank string, as an alternative  */
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

      var engineSoapString = '<ond:Engine' + ' ' + 'Flatten=' + '\'' + flatten + '\' ' + 'Intensity=' + '\'' + intensity + '\' ' + 'PromptSet=' + '\'' + promptSet + '\' ' + 'Threshold=' + '\'' + threshold + '\' ' + 'Timeout=' + '\'' + timeout + '\' ' + '>' + engineType + '</ond:Engine>';

      return engineSoapString;
    };

    /*
        * @returns {String}
        */
    this._buildSoapNamespaceSubString = function () {
      return 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' + 'xmlns:ond="http://www.qas.com/OnDemand-2011-03"';
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
    this._buildSoapLayoutString = function () {
      var layoutType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'AllElements';

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

    /* Taken from X2JS */
    this._parseDOMChildren = function (node, path) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      config = config || {};
      initConfigDefaults();

      function initConfigDefaults() {
        if (config.escapeMode === undefined) {
          config.escapeMode = true;
        }

        config.attributePrefix = config.attributePrefix || "_";
        config.arrayAccessForm = config.arrayAccessForm || "none";
        config.emptyNodeForm = config.emptyNodeForm || "text";

        if (config.enableToStringFunc === undefined) {
          config.enableToStringFunc = true;
        }
        config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];
        if (config.skipEmptyTextNodesForObj === undefined) {
          config.skipEmptyTextNodesForObj = true;
        }
        if (config.stripWhitespaces === undefined) {
          config.stripWhitespaces = true;
        }
        config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];

        if (config.useDoubleQuotes === undefined) {
          config.useDoubleQuotes = false;
        }

        config.xmlElementsFilter = config.xmlElementsFilter || [];
        config.jsonPropertiesFilter = config.jsonPropertiesFilter || [];

        if (config.keepCData === undefined) {
          config.keepCData = false;
        }
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
        if (nodeLocalName == null) // Yeah, this is IE!!
          nodeLocalName = node.baseName;
        if (nodeLocalName == null || nodeLocalName == "") // =="" is IE too
          nodeLocalName = node.nodeName;
        return nodeLocalName;
      }

      function getNodePrefix(node) {
        return node.prefix;
      }

      function escapeXmlChars(str) {
        if (typeof str == "string") return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');else return str;
      }

      function unescapeXmlChars(str) {
        return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
      }

      function checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
        var idx = 0;
        for (; idx < stdFiltersArrayForm.length; idx++) {
          var filterPath = stdFiltersArrayForm[idx];
          if (typeof filterPath === "string") {
            if (filterPath == path) break;
          } else if (filterPath instanceof RegExp) {
            if (filterPath.test(path)) break;
          } else if (typeof filterPath === "function") {
            if (filterPath(obj, name, path)) break;
          }
        }
        return idx != stdFiltersArrayForm.length;
      }

      function toArrayAccessForm(obj, childName, path) {
        switch (config.arrayAccessForm) {
          case "property":
            if (!(obj[childName] instanceof Array)) obj[childName + "_asArray"] = [obj[childName]];else obj[childName + "_asArray"] = obj[childName];
            break;
          /*case "none":
          	break;*/
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
        if (secondBits.length > 1) d.setMilliseconds(secondBits[1]);

        // Get supplied time zone offset in minutes
        if (bits[6] && bits[7]) {
          var offsetMinutes = bits[6] * 60 + Number(bits[7]);
          var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';

          // Apply the sign
          offsetMinutes = 0 + (sign == '-' ? -1 * offsetMinutes : offsetMinutes);

          // Apply offset and local timezone
          d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
        } else if (prop.indexOf("Z", prop.length - 1) !== -1) {
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
          } else return value;
        } else return value;
      }

      function checkXmlElementsFilter(obj, childType, childName, childPath) {
        if (childType == DOMNodeTypes.ELEMENT_NODE && config.xmlElementsFilter.length > 0) {
          return checkInStdFiltersArrayForm(config.xmlElementsFilter, obj, childName, childPath);
        } else return true;
      }

      if (node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
        var result = new Object();
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
      } else if (node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
        var result = new Object();
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
              } else {
                if (result[childName] != null) {
                  if (!(result[childName] instanceof Array)) {
                    result[childName] = [result[childName]];
                    toArrayAccessForm(result, childName, childPath);
                  }
                }
                result[childName][result[childName].length] = this._parseDOMChildren(child, childPath);
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
          if (config.stripWhitespaces) result.__text = result.__text.trim();
          delete result["#text"];
          if (config.arrayAccessForm == "property") delete result["#text_asArray"];
          result.__text = checkFromXmlDateTimePaths(result.__text, childName, path + "." + childName);
        }
        if (result["#cdata-section"] != null) {
          result.__cdata = result["#cdata-section"];
          delete result["#cdata-section"];
          if (config.arrayAccessForm == "property") delete result["#cdata-section_asArray"];
        }

        if (result.__cnt == 0 && config.emptyNodeForm == "text") {
          result = '';
        } else if (result.__cnt == 1 && result.__text != null) {
          result = result.__text;
        } else if (result.__cnt == 1 && result.__cdata != null && !config.keepCData) {
          result = result.__cdata;
        } else if (result.__cnt > 1 && result.__text != null && config.skipEmptyTextNodesForObj) {
          if (config.stripWhitespaces && result.__text == "" || result.__text.trim() == "") {
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
      } else if (node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
        return node.nodeValue;
      }
    };
  };

  var helper = new _proWebHelpers();

  /* Public API */
  EDQ.address = {

    /* ProWeb is an abstraction of our ProOnDemandService, which interoperates with the SOAP XML service */
    proWeb: {
      doCanSearch: helper.doCanSearch.bind(helper),
      doGetAddress: helper.doGetAddress.bind(helper),
      doGetData: helper.doGetData.bind(helper),
      doGetDataMapDetail: helper.doGetDataMapDetail.bind(helper),
      doGetExampleAddresses: helper.doGetExampleAddresses.bind(helper),
      doGetLayouts: helper.doGetLayouts.bind(helper),
      doGetLicenseInfo: helper.doGetLicenseInfo.bind(helper),
      doGetPromptSet: helper.doGetPromptSet.bind(helper),
      doGetSystemInfo: helper.doGetSystemInfo.bind(helper),
      doRefine: helper.doRefine.bind(helper),
      doSearch: helper.doSearch.bind(helper)
    }
  };
}).call(this);