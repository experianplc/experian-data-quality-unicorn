/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../lib/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var autocompletion_js_1 = __webpack_require__(1);
var verification_modal_1 = __webpack_require__(2);
var state_mapper_1 = __webpack_require__(3);
// Polyfills for compatiability
// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
(function () {
    window.autoComplete = autocompletion_js_1.default;
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
        modalElement.innerHTML = verification_modal_1.generateModal(mode);
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
     * @param {Event} event
     *
     * @returns {undefined}
     */
    function finalCallback(newEvent) {
        var savedTarget = newEvent['savedTarget'];
        var callback = EDQ_CONFIG.PRO_WEB_CALLBACK;
        if (callback) {
            if (typeof (callback) === "string") {
                eval(callback);
            }
            else if (typeof (callback) === "function") {
                callback(newEvent.savedTarget, newEvent);
            }
            else {
                throw "PRO_WEB_CALLBACK must be either text resolving to javascript or a function";
            }
        }
        else {
            // Reverting the element changes appears to make things a bit easier.
            savedTarget["on" + newEvent.type] = newEvent['originalEvent'];
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
                state_mapper_1.stateMapper(fieldElement.field, rawAddress[fieldElement.elements[0]]);
                return;
            }
            fieldElement.field.value
                = fieldElement.elements.map(function (addressElement) {
                    return rawAddress[addressElement] == '[object Object]' ? '' : rawAddress[addressElement];
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
                        var rawAddress_1 = createRawAddressMap(addressLines);
                        EDQ_CONFIG.PRO_WEB_MAPPING.forEach(function (mapping) {
                            interactionAddressField_1[mapping['modalFieldSelector']] =
                                modalElement.querySelector(mapping['modalFieldSelector'].replace('original-', ''));
                            interactionAddressField_1[mapping['modalFieldSelector']].innerText = mapping['elements'].map(function (element) {
                                return rawAddress_1[element];
                            }).join(mapping['separator']);
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
                        new autocompletion_js_1.default({
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
                                /** The HTML shown for each picklist item */
                                function picklistHtml(moniker, picklist, postCode, multiples) {
                                    return "<div\n                          class=\"" + (multiples ? 'edq-disabled-address' : 'edq-global-intuitive-address-suggestion') + "\"\n                          data-moniker='" + moniker + "'>\n                            <div class='edq-address-picklist'>" + picklist.split(',')[0] + "</div>\n                            <div class='edq-address-postal-code'>" + postCode + "</div>\n                       </div>";
                                }
                                var picklist = item.Picklist;
                                var postCode = item.Postcode;
                                var moniker = item.Moniker;
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
        // For Firefox/Chrome support
        // See: https://stackoverflow.com/questions/95731/why-does-an-onclick-property-set-with-setattribute-fail-to-work-in-ie
        triggerElement.setAttribute("on" + eventType, "function(event) {\n      var newEvent = createNewEvent(event);\n      newEvent['savedTarget'] = triggerElement.cloneNode();\n      newEvent['originalEvent'] = originalTriggerEvent;\n      submitForm(newEvent);\n    }");
        triggerElement["on" + eventType] = function (event) {
            var newEvent = createNewEvent(event);
            newEvent['savedTarget'] = triggerElement.cloneNode();
            newEvent['originalEvent'] = originalTriggerEvent;
            submitForm(newEvent);
        };
    });
}).call(this);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
    JavaScript AutoComplete v1.0
    Copyright (c) 2018 Experian
    GitHub: https://github.com/experianplc/AutoComplete
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    function autoComplete(options) {
        if (!document.querySelector) {
            return;
        }
        function hasClass(el, className) {
            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        }
        function addEvent(el, type, handler) {
            if (el.attachEvent) {
                el.attachEvent('on' + type, handler);
            }
            else {
                el.addEventListener(type, handler);
            }
        }
        function removeEvent(el, type, handler) {
            // if (el.removeEventListener) not working in IE11
            if (el.detachEvent)
                el.detachEvent('on' + type, handler);
            else
                el.removeEventListener(type, handler);
        }
        function live(className, event, cb, context) {
            addEvent(context || document, event, function (e) {
                var found, el = e.target || e.srcElement;
                while (el && !(found = hasClass(el, className)))
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
                // Special characters should be escaped.
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
        var nodeList = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        var _loop_1 = function (i) {
            var autoCompleteElement = nodeList[i];
            autoCompleteElement.suggestionsContainer = document.createElement('div');
            autoCompleteElement.suggestionsContainer.id = 'edq-verification-suggestion-box';
            autoCompleteElement.suggestionsContainer.className = 'edq-global-intuitive-address-suggestions ' + o.menuClass;
            autoCompleteElement.autocompleteAttr = autoCompleteElement.getAttribute('autocomplete');
            autoCompleteElement.setAttribute('autocomplete', 'off');
            autoCompleteElement.cache = {};
            autoCompleteElement.lastVal = '';
            autoCompleteElement.updateSC = function (resize, next) {
                var rect = autoCompleteElement.getBoundingClientRect();
                autoCompleteElement.suggestionsContainer.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
                autoCompleteElement.suggestionsContainer.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
                autoCompleteElement.suggestionsContainer.style.width = Math.round(rect.right - rect.left) + 'px';
                if (!resize) {
                    autoCompleteElement.suggestionsContainer.style.display = 'block';
                    if (!autoCompleteElement.suggestionsContainer.maxHeight) {
                        autoCompleteElement.suggestionsContainer.maxHeight = parseInt(String((window.getComputedStyle ? getComputedStyle(autoCompleteElement.suggestionsContainer, null) : autoCompleteElement.suggestionsContainer.currentStyle).maxHeight));
                    }
                    if (!autoCompleteElement.suggestionsContainer.suggestionHeight) {
                        autoCompleteElement.suggestionsContainer.suggestionHeight = autoCompleteElement.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion').offsetHeight;
                    }
                    if (autoCompleteElement.suggestionsContainer.suggestionHeight && !next) {
                        autoCompleteElement.suggestionsContainer.scrollTop = 0;
                    }
                    else {
                        var scrTop = autoCompleteElement.suggestionsContainer.scrollTop, selTop = next.getBoundingClientRect().top - autoCompleteElement.suggestionsContainer.getBoundingClientRect().top;
                        if (selTop + autoCompleteElement.suggestionsContainer.suggestionHeight - autoCompleteElement.suggestionsContainer.maxHeight > 0)
                            autoCompleteElement.suggestionsContainer.scrollTop = selTop + autoCompleteElement.suggestionsContainer.suggestionHeight + scrTop - autoCompleteElement.suggestionsContainer.maxHeight;
                        else if (selTop < 0)
                            autoCompleteElement.suggestionsContainer.scrollTop = selTop + scrTop;
                    }
                }
            };
            addEvent(window, 'resize', autoCompleteElement.updateSC);
            document.body.appendChild(autoCompleteElement.suggestionsContainer);
            live('edq-global-intuitive-address-suggestion', 'mouseleave', function () {
                var sel = autoCompleteElement.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
                if (sel)
                    setTimeout(function () { sel.className = sel.className.replace('selected', ''); }, 20);
            }, autoCompleteElement.suggestionsContainer);
            live('edq-global-intuitive-address-suggestion', 'mouseover', function () {
                var sel = autoCompleteElement.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
                if (sel)
                    sel.className = sel.className.replace('selected', '');
                this.className += ' selected';
            }, autoCompleteElement.suggestionsContainer);
            live('edq-global-intuitive-address-suggestion', 'mousedown', function (e) {
                if (hasClass(this, 'edq-global-intuitive-address-suggestion')) {
                    var v = this.getAttribute('data-format');
                    o.onSelect(e, v, this);
                    autoCompleteElement.suggestionsContainer.style.display = 'none';
                }
            }, autoCompleteElement.suggestionsContainer);
            autoCompleteElement.blurHandler = function () {
                var over_sb;
                try {
                    over_sb = document.querySelector('.edq-global-intuitive-address-suggestions:hover');
                }
                catch (e) {
                    over_sb = 0;
                }
                if (!over_sb) {
                    autoCompleteElement.lastVal = autoCompleteElement.value;
                    autoCompleteElement.suggestionsContainer.style.display = 'none';
                    setTimeout(function () { autoCompleteElement.suggestionsContainer.style.display = 'none'; }, 350); // hide suggestions on fast input
                }
                else if (autoCompleteElement !== document.activeElement)
                    setTimeout(function () { autoCompleteElement.focus(); }, 20);
            };
            addEvent(autoCompleteElement, 'blur', autoCompleteElement.blurHandler);
            var suggest = function (data) {
                var val = autoCompleteElement.value;
                autoCompleteElement.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i_1 = 0; i_1 < data.length; i_1++)
                        s += o.renderItem(data[i_1], val);
                    autoCompleteElement.suggestionsContainer.innerHTML = s;
                    autoCompleteElement.updateSC(0);
                }
                else
                    autoCompleteElement.suggestionsContainer.style.display = 'none';
            };
            autoCompleteElement.keydownHandler = function (e) {
                var key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key == 40 || key == 38) && autoCompleteElement.suggestionsContainer.innerHTML) {
                    var next = void 0, sel = autoCompleteElement.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
                    if (!sel) {
                        next = (key == 40) ? autoCompleteElement.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion') : autoCompleteElement.suggestionsContainer.childNodes[autoCompleteElement.suggestionsContainer.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        autoCompleteElement.value = next.getAttribute('data-suggestion');
                    }
                    else {
                        next = (key == 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            autoCompleteElement.value = next.getAttribute('data-suggestion');
                        }
                        else {
                            sel.className = sel.className.replace('selected', '');
                            autoCompleteElement.value = autoCompleteElement.lastVal;
                            next = 0;
                        }
                    }
                    autoCompleteElement.updateSC(0, next);
                    return false;
                }
                else if (key == 27) {
                    autoCompleteElement.value = autoCompleteElement.lastVal;
                    autoCompleteElement.suggestionsContainer.style.display = 'none';
                }
                else if (key == 13 || key == 9) {
                    var sel = autoCompleteElement.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
                    if (sel && autoCompleteElement.suggestionsContainer.style.display != 'none') {
                        o.onSelect(e, sel.getAttribute('data-format'), sel);
                        setTimeout(function () { autoCompleteElement.suggestionsContainer.style.display = 'none'; }, 20);
                    }
                }
            };
            addEvent(autoCompleteElement, 'keydown', autoCompleteElement.keydownHandler);
            autoCompleteElement.keyupHandler = function (e) {
                var key = window.event ? e.keyCode : e.which;
                if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
                    var val_1 = autoCompleteElement.value;
                    if (val_1.length >= o.minChars) {
                        if (val_1 != autoCompleteElement.lastVal) {
                            autoCompleteElement.lastVal = val_1;
                            clearTimeout(autoCompleteElement.timer);
                            if (o.cache) {
                                if (val_1 in autoCompleteElement.cache) {
                                    suggest(autoCompleteElement.cache[val_1]);
                                    return;
                                }
                                // no requests if previous suggestions were empty
                                for (var i_2 = 1; i_2 < val_1.length - o.minChars; i_2++) {
                                    var part = val_1.slice(0, val_1.length - i_2);
                                    if (part in autoCompleteElement.cache && !autoCompleteElement.cache[part].length) {
                                        suggest([]);
                                        return;
                                    }
                                }
                            }
                            autoCompleteElement.timer = setTimeout(function () { o.source(val_1, suggest); }, o.delay);
                        }
                    }
                    else {
                        autoCompleteElement.lastVal = val_1;
                        autoCompleteElement.suggestionsContainer.style.display = 'none';
                    }
                }
            };
            addEvent(autoCompleteElement, 'keyup', autoCompleteElement.keyupHandler);
            autoCompleteElement.focusHandler = function (e) {
                autoCompleteElement.lastVal = '\n';
                autoCompleteElement.keyupHandler(e);
            };
            if (!o.minChars)
                addEvent(autoCompleteElement, 'focus', autoCompleteElement.focusHandler);
        };
        // Preserve backwards compatiability with older browsers by using C style for-loop.
        for (var i = 0; i < nodeList.length; i++) {
            _loop_1(i);
        }
        ;
        this.destroy = function () {
            // Preserve backwards compatiability with older browsers by using C style for-loop.
            for (var i = 0; i < nodeList.length; i++) {
                var self_1 = nodeList[i];
                removeEvent(window, 'resize', self_1.updateSC);
                removeEvent(self_1, 'blur', self_1.blurHandler);
                removeEvent(self_1, 'focus', self_1.focusHandler);
                removeEvent(self_1, 'keydown', self_1.keydownHandler);
                removeEvent(self_1, 'keyup', self_1.keyupHandler);
                if (self_1.autocompleteAttr) {
                    self_1.setAttribute('autocomplete', self_1.autocompleteAttr);
                }
                else {
                    self_1.removeAttribute('autocomplete');
                }
                document.body.removeChild(self_1.suggestionsContainer);
                self_1 = null;
            }
            ;
        };
    }
    ;
    return autoComplete;
})();
//# sourceMappingURL=autocompletion.js.map


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function generateModal(mode) {
    return "<div class=\"edq-overlay\" id=\"edq-overlay\">\n      <div class=\"w-100 w-50-ns center ba v-top v-mid-ns mt4-m mt6-l\">\n        <div class=\"edq-modal-header-color ph3 pv2 tc\">\n          <div id=\"edq-close-modal\" class=\"pointer f6 fw6 fr pv2 ph2\">\n            x\n          </div>\n          <h2 id=\"edq-modal-header\">" + (mode == undefined ? 'Confirm unverified address' : 'Confirm updated address') + "</h2>\n        </div>\n\n        <div class=\"bg-white cf ph4 pb4\">\n          <div id=\"segment--interaction-search\" class=\"fl w-100 w-50-ns " + ((mode === 'Multiple') || (mode === 'StreetPartial') || (mode === 'PremisesPartial') ? '' : 'edq-hide') + "\">\n            <div id=\"interaction-address\" class=\"pa2\">\n              <h4 id=\"interaction-address--prompt\"></h4>\n              <input id=\"interaction-address--select-field\" class=\"w-100 w-90-ns\"></input>\n            </div>\n          </div>\n\n          <div id=\"segment--interaction\" class=\"fl w-100 w-50-ns " + (mode === 'InteractionRequired' ? '' : 'edq-hide') + "\">\n            <div id=\"interaction-address\" class=\"h4 pa2\">\n              <h4 id=\"interaction-address--interaction-prompt\">Updated address</h4>\n              <div id=\"interaction-address--address-line-one\"></div>\n              <div id=\"interaction-address--address-line-two\"></div>\n              <div id=\"interaction-address--locality\"></div>\n              <div id=\"interaction-address--province\"></div>\n              <div id=\"interaction-address--postal-code\"></div>\n            </div>\n          </div>\n\n          <div id=\"segment--use-original\" class=\"fl w-100 w-50-ns\">\n            <div id=\"interaction-address-original\" class=\"h4 pa2\">\n              <h4>Original address</h4>\n              <div id=\"interaction-address--original-address-line-one\"></div>\n              <div id=\"interaction-address--original-address-line-two\"></div>\n              <div id=\"interaction-address--original-locality\"></div>\n              <div id=\"interaction-address--original-province\"></div>\n              <div id=\"interaction-address--original-postal-code\"></div>\n            </div>\n          </div>\n\n          <div class=\"cf\">\n            <div class=\"fl mt3 mt4-ns w-100 w-50-ns\">\n              <button id=\"interaction--use-updated\" class=\"pointer ba pa2 w-100 mt3-m w-auto-ns " + (mode === 'InteractionRequired' ? '' : 'edq-hide') + "\">\n                Use updated address\n              </button>\n            </div>\n\n            <div class=\"fl mt3 mt4-ns w-100 " + (mode == undefined ? '' : 'w-50-ns') + "\">\n              <button id=\"interaction--use-original\" class=\"pointer ba pa2 w-100 mt3-m \">\n                Use original address\n              </button>\n            </div>\n          </div>\n        </div>\n        </div>";
}
exports.generateModal = generateModal;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/** Build a map pairing each option innerText with the index for quick switching
 *
 * @param {Element} field
 * @param {String} value - a state value returned from ProWeb, e.g. MA
 *
 * @returns {undefined}
*/
Object.defineProperty(exports, "__esModule", { value: true });
function stateMapper(field, value) {
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
exports.stateMapper = stateMapper;
;


/***/ })
/******/ ]);