// Polyfills for compatiability
// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
    */
var autoComplete = (function () {
    // "use strict";
    function autoComplete(options) {
        if (!document.querySelector)
            return;
        // helpers
        function hasClass(el, className) { return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className); }
        function addEvent(el, type, handler) {
            if (el.attachEvent)
                el.attachEvent('on' + type, handler);
            else
                el.addEventListener(type, handler);
        }
        function removeEvent(el, type, handler) {
            // if (el.removeEventListener) not working in IE11
            if (el.detachEvent)
                el.detachEvent('on' + type, handler);
            else
                el.removeEventListener(type, handler);
        }
        function live(elClass, event, cb, context) {
            addEvent(context || document, event, function (e) {
                var found, el = e.target || e.srcElement;
                while (el && !(found = hasClass(el, elClass)))
                    el = el.parentElement;
                if (found)
                    cb.call(el, e);
            });
        }
        var o = {
            selector: '',
            source: function (v, s) { },
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: function (item, search) {
                // escape special characters
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="edq-global-intuitive-address-suggestion" data-format="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
            },
            onSelect: function (e, term, item) { }
        };
        for (var k in options) {
            if (options.hasOwnProperty(k))
                o[k] = options[k];
        }
        // init
        var elems = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (var i = 0; i < elems.length; i++) {
            var that = elems[i];
            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.id = 'edq-verification-suggestion-box';
            that.sc.className = 'edq-global-intuitive-address-suggestions ' + o.menuClass;
            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.lastVal = '';
            that.updateSC = function (resize, next) {
                var rect = that.getBoundingClientRect();
                that.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
                that.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
                that.sc.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        that.sc.maxHeight = parseInt(String((window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle).maxHeight));
                    }
                    if (!that.sc.suggestionHeight)
                        that.sc.suggestionHeight = that.sc.querySelector('.edq-global-intuitive-address-suggestion').offsetHeight;
                    if (that.sc.suggestionHeight)
                        if (!next)
                            that.sc.scrollTop = 0;
                        else {
                            var scrTop = that.sc.scrollTop, selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            else if (selTop < 0)
                                that.sc.scrollTop = selTop + scrTop;
                        }
                }
            };
            addEvent(window, 'resize', that.updateSC);
            document.body.appendChild(that.sc);
            live('edq-global-intuitive-address-suggestion', 'mouseleave', function (e) {
                var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                if (sel)
                    setTimeout(function () { sel.className = sel.className.replace('selected', ''); }, 20);
            }, that.sc);
            live('edq-global-intuitive-address-suggestion', 'mouseover', function (e) {
                var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                if (sel)
                    sel.className = sel.className.replace('selected', '');
                this.className += ' selected';
            }, that.sc);
            live('edq-global-intuitive-address-suggestion', 'mousedown', function (e) {
                if (hasClass(this, 'edq-global-intuitive-address-suggestion')) {
                    var v = this.getAttribute('data-format');
                    o.onSelect(e, v, this);
                    that.sc.style.display = 'none';
                }
            }, that.sc);
            that.blurHandler = function () {
                var over_sb;
                try {
                    over_sb = document.querySelector('.edq-global-intuitive-address-suggestions:hover');
                }
                catch (e) {
                    over_sb = 0;
                }
                if (!over_sb) {
                    that.lastVal = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(function () { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                }
                else if (that !== document.activeElement)
                    setTimeout(function () { that.focus(); }, 20);
            };
            addEvent(that, 'blur', that.blurHandler);
            var suggest = function (data) {
                var val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i = 0; i < data.length; i++)
                        s += o.renderItem(data[i], val);
                    that.sc.innerHTML = s;
                    that.updateSC(0);
                }
                else
                    that.sc.style.display = 'none';
            };
            that.keydownHandler = function (e) {
                var key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key == 40 || key == 38) && that.sc.innerHTML) {
                    var next, sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                    if (!sel) {
                        next = (key == 40) ? that.sc.querySelector('.edq-global-intuitive-address-suggestion') : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-suggestion');
                    }
                    else {
                        next = (key == 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-suggestion');
                        }
                        else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.lastVal;
                            next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                else if (key == 27) {
                    that.value = that.lastVal;
                    that.sc.style.display = 'none';
                }
                else if (key == 13 || key == 9) {
                    var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                    if (sel && that.sc.style.display != 'none') {
                        o.onSelect(e, sel.getAttribute('data-format'), sel);
                        setTimeout(function () { that.sc.style.display = 'none'; }, 20);
                    }
                }
            };
            addEvent(that, 'keydown', that.keydownHandler);
            that.keyupHandler = function (e) {
                var key = window.event ? e.keyCode : e.which;
                if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
                    var val = that.value;
                    if (val.length >= o.minChars) {
                        if (val != that.lastVal) {
                            that.lastVal = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) {
                                    suggest(that.cache[val]);
                                    return;
                                }
                                // no requests if previous suggestions were empty
                                for (var i = 1; i < val.length - o.minChars; i++) {
                                    var part = val.slice(0, val.length - i);
                                    if (part in that.cache && !that.cache[part].length) {
                                        suggest([]);
                                        return;
                                    }
                                }
                            }
                            that.timer = setTimeout(function () { o.source(val, suggest); }, o.delay);
                        }
                    }
                    else {
                        that.lastVal = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            addEvent(that, 'keyup', that.keyupHandler);
            that.focusHandler = function (e) {
                that.lastVal = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars)
                addEvent(that, 'focus', that.focusHandler);
        }
        // public destroy method
        this.destroy = function () {
            for (var i = 0; i < elems.length; i++) {
                var that = elems[i];
                removeEvent(window, 'resize', that.updateSC);
                removeEvent(that, 'blur', that.blurHandler);
                removeEvent(that, 'focus', that.focusHandler);
                removeEvent(that, 'keydown', that.keydownHandler);
                removeEvent(that, 'keyup', that.keyupHandler);
                if (that.autocompleteAttr)
                    that.setAttribute('autocomplete', that.autocompleteAttr);
                else
                    that.removeAttribute('autocomplete');
                document.body.removeChild(that.sc);
                that = null;
            }
        };
    }
    return autoComplete;
})();
(function () {
    window.autoComplete = autoComplete;
})();
(function () {
    var EDQ_CONFIG = window.EdqConfig || {};
    var EDQ;
    if (window.EDQ) {
        EDQ = window.EDQ;
    }
    else {
        throw 'Please make sure that EDQ Pegasus is included in your HTML before EDQ Unicorn.';
    }
    var verifier = EDQ.address.proWebOnDemand;
    if (EDQ_CONFIG.PRO_WEB_SERVICE_URL) {
        verifier = EDQ.address.proWeb;
    }
    /* The template for the modal */
    var modalHtml = function (mode) {
        return "<div class=\"edq-overlay\" id=\"edq-overlay\">\n      <div class=\"w-100 w-50-ns center v-top v-mid-ns mt4-m mt6-l\">\n        <div class=\"edq-modal-header-color ph3 pv2 tc\">\n          <div id=\"edq-close-modal\" class=\"pointer f6 fw6 fr pv2 ph2\">\n            x\n          </div>\n          <h2 id=\"edq-modal-header\">" + (mode == undefined ? 'Confirm unverified address' : 'Confirm updated address') + "</h2>\n        </div>\n\n        <div class=\"bg-white cf ph4 pb4\">\n          <div id=\"segment--interaction-search\" class=\"fl w-100 w-50-ns " + ((mode === 'Multiple') || (mode === 'StreetPartial') || (mode === 'PremisesPartial') ? '' : 'edq-hide') + "\">\n            <div id=\"interaction-address\" class=\"pa2\">\n              <h4 id=\"interaction-address--prompt\"></h4>\n              <input id=\"interaction-address--select-field\" class=\"w-100 w-90-ns\"></input>\n            </div>\n          </div>\n\n          <div id=\"segment--interaction\" class=\"fl w-100 w-50-ns " + (mode === 'InteractionRequired' ? '' : 'edq-hide') + "\">\n            <div id=\"interaction-address\" class=\"h4 pa2\">\n              <h4 id=\"interaction-address--interaction-prompt\">Updated address</h4>\n              <div id=\"interaction-address--address-line-one\"></div>\n              <div id=\"interaction-address--address-line-two\"></div>\n              <div id=\"interaction-address--locality\"></div>\n              <div id=\"interaction-address--province\"></div>\n              <div id=\"interaction-address--postal-code\"></div>\n            </div>\n          </div>\n\n          <div id=\"segment--use-original\" class=\"fl w-100 w-50-ns\">\n            <div id=\"interaction-address-original\" class=\"h4 pa2\">\n              <h4>Original address</h4>\n              <div id=\"interaction-address--original-address-line-one\"></div>\n              <div id=\"interaction-address--original-address-line-two\"></div>\n              <div id=\"interaction-address--original-locality\"></div>\n              <div id=\"interaction-address--original-province\"></div>\n              <div id=\"interaction-address--original-postal-code\"></div>\n            </div>\n          </div>\n\n          <div class=\"cf\">\n            <div class=\"fl mt3 mt4-ns w-100 w-50-ns\">\n              <button id=\"interaction--use-updated\" class=\"pointer ba pa2 w-100 mt3-m w-auto-ns " + (mode === 'InteractionRequired' ? '' : 'edq-hide') + "\">\n                Use updated address\n              </button>\n            </div>\n\n            <div class=\"fl mt3 mt4-ns w-100 " + (mode == undefined ? '' : 'w-50-ns') + "\">\n              <button id=\"interaction--use-original\" class=\"pointer ba pa2 w-100 mt3-m \">\n                Use original address\n              </button>\n            </div>\n          </div>\n        </div>\n        </div>";
    };
    /** Closes the modal by removing it from the DOM
     *
     * @returns {undefined}
     */
    function closeModal() {
        document.getElementById('edq-overlay-container').remove();
    }
    /** Removes any extras that the modal created, notably the autocomplete suggestion box
     *
     * @returns {undefined}
     */
    function removeModalElements() {
        var suggestionBox = document.querySelector('#edq-verification-suggestion-box');
        if (suggestionBox) {
            suggestionBox.remove();
        }
    }
    /** Creates the modal and adds it to the DOM
     *
     * @param {String} mode
     * @param {Event} newEvent
     *
     * @returns {Element}
     */
    function openModal(mode, newEvent) {
        if (document.getElementById('edq-overlay-container')) {
            return document.getElementById('edq-overlay-container');
        }
        var modalElement = document.createElement('div');
        modalElement.id = 'edq-overlay-container';
        modalElement.innerHTML = modalHtml(mode);
        document.body.appendChild(modalElement);
        addModalEvents(modalElement, newEvent);
        return modalElement;
    }
    /** Creates a new event per https://stackoverflow.com/a/26596324
     *
     * @param {Event} oldEvent
     *
     * @returns {Event} newEvent
     */
    function createNewEvent(oldEvent) {
        // This handles the case where the browser is not IE
        if (typeof Event === "function") {
            return new oldEvent.constructor(oldEvent.type, oldEvent);
        }
        var newEvent = document.createEvent('Event');
        newEvent.initEvent(oldEvent.type, true, false);
        return newEvent;
    }
    /** Adds event listeners to the modal
     *
     * @param {Element} modalElement
     * @param {Event} newEvent
     *
     * @returns {undefined}
     */
    function addModalEvents(modalElement, newEvent) {
        modalElement.querySelector('#interaction--use-original').onclick = function (event) {
            useOriginalAddress(newEvent);
        };
        modalElement.querySelector('#edq-close-modal').onclick = function () {
            modalElement.remove();
            var suggestionBox = document.querySelector('#edq-verification-suggestion-box');
            if (suggestionBox) {
                suggestionBox.remove();
            }
        };
    }
    /**
     * Completes the verification process, and uses the callback
     *
     * @param {Element} element
     * @param {Event} event
     *
     * @returns {undefined}
     */
    function finalCallback(newEvent) {
        var originalTarget = newEvent['originalTarget'];
        var callback = EDQ_CONFIG.PRO_WEB_CALLBACK;
        if (callback) {
            if (typeof (callback) === "string") {
                eval(callback);
            }
            else if (typeof (callback) === "function") {
                callback(newEvent.originalTarget, newEvent);
            }
            else {
                throw "PRO_WEB_CALLBACK must be either text resolving to javascript or a function";
            }
        }
        else {
            // Reverting the element changes appears to make things a bit easier.
            originalTarget["on" + newEvent.type] = newEvent['originalEvent'];
        }
    }
    /** Uses the original address
     *
     * @param {Event} event
     * @returns {undefined}
     */
    function useOriginalAddress(event) {
        closeModal();
        removeModalElements();
        finalCallback(event);
    }
    /** Returns an object with AddressLines as keys and AddressLine labels as its values
     *
     * @param {Object} soapObject
     *
     * @returns {Object}
     */
    function createRawAddressMap(soapObject) {
        var returnObject = {};
        soapObject.forEach(function (addressLine) {
            returnObject[addressLine.Label] = addressLine.Line || null;
        });
        return returnObject;
    }
    /** Updates the values from the mapping value fields
     *
     * @param {Array} mappings
     * @param {Object} rawAddress
     *
     * @returns {undefined}
     */
    function updateValuesFromMapping(mappings, rawAddress) {
        mappings.forEach(function (fieldElement) {
            if (fieldElement.field.tagName === "SELECT") {
                setStateSelectedIndex(fieldElement.field, rawAddress[fieldElement.elements[0]]);
                return;
            }
            fieldElement.field.value
                = fieldElement.elements.map(function (addressElement) {
                    return rawAddress[addressElement];
                }).join(fieldElement.separator);
        });
    }
    /** Displays the original address
     *
     * @returns {undefined}
     */
    function displayOriginalAddress() {
        EDQ_CONFIG.PRO_WEB_MAPPING.forEach(function (mapper) {
            try {
                document.querySelector(mapper.modalFieldSelector).innerText = mapper.field.value;
            }
            catch (e) {
            }
        });
    }
    /** Build a map pairing each option innerText with the index for quick switching
     *
     * @param {Element} field
     * @param {String} value - a state value returned from ProWeb, e.g. MA
     *
     * @returns {undefined}
     */
    function setStateSelectedIndex(field, value) {
        var stateIndexMap = {};
        for (var i = 0; i < field.length; i++) {
            stateIndexMap[field.children[i].innerText.toLowerCase()] = field.children[i].index;
        }
        // TODO: Support other places other than the United States
        var us_states_abbr_to_full = {
            'al': 'alabama',
            'ak': 'alaska',
            'as': 'american samoa',
            'az': 'arizona',
            'ar': 'arkansas',
            'ca': 'california',
            'co': 'colorado',
            'ct': 'connecticut',
            'de': 'delaware',
            'dc': 'district of columbia',
            'fm': 'federated states of micronesia',
            'fl': 'florida',
            'ga': 'georgia',
            'gu': 'guam',
            'hi': 'hawaii',
            'id': 'idaho',
            'il': 'illinois',
            'in': 'indiana',
            'ia': 'iowa',
            'ks': 'kansas',
            'ky': 'kentucky',
            'la': 'louisiana',
            'me': 'maine',
            'mh': 'marshall islands',
            'md': 'maryland',
            'ma': 'massachusetts',
            'mi': 'michigan',
            'mn': 'minnesota',
            'ms': 'mississippi',
            'mo': 'missouri',
            'mt': 'montana',
            'ne': 'nebraska',
            'nv': 'nevada',
            'nh': 'new hampshire',
            'nj': 'new jersey',
            'nm': 'new mexico',
            'ny': 'new york',
            'nc': 'north carolina',
            'nd': 'north dakota',
            'mp': 'northern mariana islands',
            'oh': 'ohio',
            'ok': 'oklahoma',
            'or': 'oregon',
            'pw': 'palau',
            'pa': 'pennsylvania',
            'pr': 'puerto rico',
            'ri': 'rhode island',
            'sc': 'south carolina',
            'sd': 'south dakota',
            'tn': 'tennessee',
            'tx': 'texas',
            'ut': 'utah',
            'vt': 'vermont',
            'vi': 'virgin islands',
            'va': 'virginia',
            'wa': 'washington',
            'wv': 'west virginia',
            'wi': 'wisconsin',
            'wy': 'wyoming'
        };
        var us_states_full_to_abbr = {
            'alabama': 'al',
            'alaska': 'ak',
            'american samoa': 'as',
            'arizona': 'az',
            'arkansas': 'ar',
            'california': 'ca',
            'colorado': 'co',
            'connecticut': 'ct',
            'delaware': 'de',
            'district of columbia': 'dc',
            'federated states of micronesia': 'fm',
            'florida': 'fl',
            'georgia': 'ga',
            'guam': 'gu',
            'hawaii': 'hi',
            'idaho': 'id',
            'illinois': 'il',
            'indiana': 'in',
            'iowa': 'ia',
            'kansas': 'ks',
            'kentucky': 'ky',
            'louisiana': 'la',
            'maine': 'me',
            'marshall islands': 'mh',
            'maryland': 'md',
            'massachusetts': 'ma',
            'michigan': 'mi',
            'minnesota': 'mn',
            'mississippi': 'ms',
            'missouri': 'mo',
            'montana': 'mt',
            'nebraska': 'ne',
            'nevada': 'nv',
            'new hampshire': 'nh',
            'new jersey': 'nj',
            'new mexico': 'nm',
            'new york': 'ny',
            'north carolina': 'nc',
            'north dakota': 'nd',
            'northern mariana islands': 'mp',
            'ohio': 'oh',
            'oklahoma': 'ok',
            'oregon': 'or',
            'palau': 'pw',
            'pennsylvania': 'pa',
            'puerto rico': 'pr',
            'rhode island': 'ri',
            'south carolina': 'sc',
            'south dakota': 'sd',
            'tennessee': 'tn',
            'texas': 'tx',
            'utah': 'ut',
            'vermont': 'vt',
            'virgin islands': 'vi',
            'virginia': 'va',
            'washington': 'wa',
            'west virginia': 'wv',
            'wisconsin': 'wi',
            'wyoming': 'wy'
        };
        var lowerCaseValue = value.toLowerCase();
        if (us_states_full_to_abbr[lowerCaseValue]) {
            field.selectedIndex = [stateIndexMap[us_states_full_to_abbr[lowerCaseValue]]];
        }
        else if (us_states_abbr_to_full[lowerCaseValue]) {
            field.selectedIndex = [stateIndexMap[lowerCaseValue]];
        }
    }
    /** Functionality for what should occur after a phone press
     *
     * @returns {undefined}
     */
    function submitForm(newEvent) {
        var addressQuery = EDQ_CONFIG.PRO_WEB_MAPPING.map(function (element) {
            return element.field.value || element.field.innerText;
        }).join(',');
        var xhr = verifier.doSearch({
            country: EDQ_CONFIG.PRO_WEB_COUNTRY,
            engineOptions: {},
            engineType: 'Verification',
            layout: EDQ_CONFIG.PRO_WEB_LAYOUT,
            addressQuery: addressQuery,
            formattedAddressInPicklist: false,
            callback: function (data, error) {
                if (error) {
                    finalCallback(newEvent);
                    return;
                }
                var verifyLevel = data.Envelope.Body.QASearchResult._VerifyLevel;
                var addressLines;
                var modalElement;
                switch (verifyLevel) {
                    case 'InteractionRequired':
                        addressLines = data.Envelope.Body.QASearchResult.QAAddress.AddressLine;
                        modalElement = openModal(verifyLevel, newEvent);
                        modalElement.querySelector('#interaction--use-updated').onclick = function () {
                            updateValuesFromMapping(EDQ_CONFIG.PRO_WEB_MAPPING, createRawAddressMap(addressLines));
                            closeModal();
                            finalCallback(newEvent);
                        };
                        displayOriginalAddress();
                        var interactionAddressField_1 = {};
                        // TODO: This is currently coupled with the layout EDQDemoLayout, this should be customizable, and fixed
                        var interactionFieldMapping_1 = {
                            'address-line-one': 'AddressLine1',
                            'address-line-two': 'AddressLine2',
                            'locality': 'CityLocality',
                            'province': 'StateProvince',
                            'postal-code': 'PostalCode'
                        };
                        var rawAddress_1 = createRawAddressMap(addressLines);
                        var modalFields = ['address-line-one', 'address-line-two', 'locality', 'province', 'postal-code'];
                        modalFields.forEach(function (field) {
                            interactionAddressField_1[field] = modalElement.querySelector("#interaction-address--" + field);
                            interactionAddressField_1[field].innerText = rawAddress_1[interactionFieldMapping_1[field]];
                        });
                        break;
                    case 'Verified':
                        addressLines = data.Envelope.Body.QASearchResult.QAAddress.AddressLine;
                        updateValuesFromMapping(EDQ_CONFIG.PRO_WEB_MAPPING, createRawAddressMap(addressLines));
                        finalCallback(newEvent);
                        break;
                    case 'Multiple':
                    case 'StreetPartial':
                    case 'PremisesPartial':
                        modalElement = openModal(verifyLevel, newEvent);
                        modalElement.querySelector('#interaction-address--prompt').innerText
                            = data.Envelope.Body.QASearchResult.QAPicklist.Prompt;
                        displayOriginalAddress();
                        new autoComplete({
                            minChars: 0,
                            selector: modalElement.querySelector('#interaction-address--select-field'),
                            delay: 25,
                            cache: false,
                            onSelect: function (event, term, item) {
                                verifier.doGetAddress({
                                    layout: EDQ_CONFIG.PRO_WEB_LAYOUT,
                                    moniker: item.getAttribute('data-moniker'),
                                    callback: function (address) {
                                        updateValuesFromMapping(EDQ_CONFIG.PRO_WEB_MAPPING, createRawAddressMap(address.Envelope.Body.Address.QAAddress.AddressLine));
                                        closeModal();
                                        removeModalElements();
                                        finalCallback(newEvent);
                                    }
                                });
                            },
                            renderItem: function (item, search) {
                                /** The HTML shown for each picklist item
                                 *
                                 * @param {String} moniker
                                 * @param {String} picklist
                                 * @param {String} postCode
                                 * @param {Boolean} multiples
                                 *
                                 * @returns {String}
                                 */
                                function picklistHtml(moniker, picklist, postCode, multiples) {
                                    return "<div\n                          class=\"" + (multiples ? 'edq-disabled-address' : 'edq-global-intuitive-address-suggestion') + "\"\n                          data-moniker='" + moniker + "'>\n                            <div class='edq-address-picklist'>" + picklist.split(',')[0] + "</div>\n                            <div class='edq-address-postal-code'>" + postCode + "</div>\n                       </div>";
                                }
                                var picklist = String(item.Picklist);
                                var postCode = String(item.Postcode);
                                var moniker = String(item.Moniker);
                                return picklistHtml(moniker, picklist, postCode, item._UnresolvableRange === "true" || item._Multiples === "true");
                            },
                            source: function (term, response) {
                                var xhr;
                                try {
                                    xhr.abort();
                                }
                                catch (e) {
                                }
                                xhr = verifier.doRefine({
                                    country: EDQ_CONFIG.PRO_WEB_COUNTRY,
                                    refineOptions: {},
                                    layout: EDQ_CONFIG.PRO_WEB_LAYOUT,
                                    moniker: data.Envelope.Body.QASearchResult.QAPicklist.FullPicklistMoniker,
                                    refinement: term,
                                    formattedAddressInPicklist: false,
                                    callback: function (data) {
                                        try {
                                            var items = data.Envelope.Body.Picklist.QAPicklist.PicklistEntry;
                                            if (items.length) {
                                                response(items);
                                            }
                                            else {
                                                response([items]);
                                            }
                                        }
                                        catch (e) {
                                        }
                                    }
                                });
                            }
                        });
                        break;
                    default:
                        openModal(verifyLevel, newEvent);
                        displayOriginalAddress();
                }
            }
        });
        try {
            xhr.timeout = EDQ_CONFIG.PRO_WEB_TIMEOUT || 2500;
        }
        catch (e) {
            // Pass the internet explorer error
        }
    }
    ;
    // Make it so each submission element and trigger are reset
    EDQ_CONFIG.PRO_WEB_SUBMIT_TRIGGERS.forEach(function (pair) {
        var eventType = pair.type;
        var triggerElement = pair.element;
        var originalTriggerEvent = triggerElement["on" + eventType];
        triggerElement["on" + eventType] = function (event) {
            var newEvent = createNewEvent(event);
            newEvent['originalTarget'] = triggerElement.cloneNode();
            newEvent['originalEvent'] = originalTriggerEvent;
            submitForm(newEvent);
        };
    });
}).call(this);
