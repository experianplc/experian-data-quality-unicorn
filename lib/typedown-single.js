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
var user_state_1 = __webpack_require__(1);
var user_states_1 = __webpack_require__(2);
var typedown_modal_1 = __webpack_require__(3);
var state_mapper_1 = __webpack_require__(4);
(function () {
    // Scoped variables
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
    var userStates = new user_states_1.UserStates();
    var picklistMoniker = null;
    var searchMethod = verifier.doSearch;
    function setPicklistMoniker(value) {
        picklistMoniker = value;
    }
    ;
    function getPicklistMoniker() {
        return picklistMoniker;
    }
    ;
    function setSearchMethod(value) {
        searchMethod = value;
    }
    function getSearchMethod() {
        return searchMethod;
    }
    var userStateContext = {
        setPicklistMoniker: setPicklistMoniker,
        setSearchMethod: setSearchMethod,
        _picklistSuggestionOnClick: _picklistSuggestionOnClick
    };
    function openModal(newEvent) {
        if (document.getElementById('edq-overlay-container')) {
            return document.getElementById('edq-overlay-container');
        }
        var htmlElement = document.querySelector('html');
        htmlElement.style.backgroundColor = 'grey';
        var modalElement = document.createElement('div');
        modalElement.id = 'edq-overlay-container';
        modalElement.innerHTML = typedown_modal_1.modal();
        document.body.appendChild(modalElement);
        modalElement.querySelector('#prompt-input').focus();
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
    /*
     ** Generates method parameters for the Typedown searches
     *
     */
    function getMethodParams(event, moniker) {
        var layout = EDQ_CONFIG.PRO_WEB_LAYOUT;
        var eventTarget = event.target;
        // doRefine
        if (event && moniker) {
            return {
                country: 'USA',
                refineOptions: {},
                layout: layout,
                moniker: moniker,
                refinement: eventTarget.value,
                formattedAddressInPicklist: false
            };
            // doSearch
        }
        else if (event && !moniker) {
            return {
                country: EDQ_CONFIG.PRO_WEB_COUNTRY,
                addressQuery: eventTarget.value,
                engineOptions: {},
                engineType: 'Typedown',
                layout: layout,
                formattedAddressInPicklist: false,
            };
            // doGetAddress
        }
        else if (!event && moniker) {
            return {
                moniker: moniker,
                layout: layout
            };
        }
    }
    /*
     * Handles the actions, including DOM updates after picklist selection
     *
     */
    function afterPicklistSelect(event, picklistMetaData, oldSearchMethod, oldPicklistMoniker) {
        var previousTypedownSteps = document.getElementById('typedown-previous-steps');
        var previousSuggestion = generatePicklistSuggestion(picklistMetaData);
        var newState = new user_state_1.UserState({
            'prompt text': document.getElementById('prompt-text').innerHTML,
            'input value': document.getElementById('prompt-input').value,
            'suggestions': document.getElementById('typedown-result').innerHTML,
            'previous suggestions': document.getElementById('typedown-previous-steps').innerHTML,
            'search method': oldSearchMethod,
            'event': event,
            'moniker': oldPicklistMoniker,
            'metadata': picklistMetaData
        }, this);
        // An EventTarget doesn't necessarily have the property value, so TypeScript is throwing an
        // error here. Casting this to an HTMLInputElement will solve the problem in this case.
        var htmlEventTarget = event.target;
        htmlEventTarget.onkeyup(event);
        htmlEventTarget.value = null;
        document.getElementById('typedown-previous-steps').appendChild(previousSuggestion);
        userStates.push(newState);
        document.getElementById('prompt-input').focus();
    }
    /*
     * Generates a picklist suggestion element to be appended to the history
     */
    function generatePicklistSuggestion(picklistMetaData) {
        var previousSuggestion = document.createElement('a');
        var initialPaddingOffset = 1; // rem
        previousSuggestion.style.paddingLeft = document.getElementById('typedown-previous-steps').children.length + initialPaddingOffset + "rem";
        previousSuggestion.innerHTML = picklistMetaData.Picklist;
        previousSuggestion.className = 'pointer shadow-hover picklist-item db link black';
        previousSuggestion.href = '#';
        previousSuggestion.tabIndex = 0;
        previousSuggestion.setAttribute('picklist-metadata', JSON.stringify(picklistMetaData));
        previousSuggestion.onclick = _picklistSuggestionOnClick;
        return previousSuggestion;
    }
    function _picklistSuggestionOnClick(event) {
        event.preventDefault();
        var metadata = JSON.parse(event.target.getAttribute('picklist-metadata'));
        for (var index = 0; index < userStates.stack.length; index++) {
            var item = userStates.stack[index];
            if (item.args.metadata.Moniker === metadata.Moniker) {
                userStates.stack = userStates.stack.slice(0, index);
                item.revertState();
                break;
            }
        }
    }
    /*
     * Updates the UI to fill in the fields
     *
     * @returns {undefined}
     */
    function finalAddressUiUpdate(data) {
        var addressLinesObject = createRawAddressMap(data.Envelope.Body.Address.QAAddress.AddressLine);
        document.getElementById('prompt-select').innerHTML = 'Accept';
        document.getElementById('prompt-input').setAttribute('disabled', 'disabled');
        // Show Final Address
        document.getElementById('typedown-final-address').classList.remove('dn');
        document.getElementById('typedown-final--address-line-one').value = addressLinesObject['AddressLine1'];
        document.getElementById('typedown-final--address-line-two').value = addressLinesObject['AddressLine2'];
        document.getElementById('typedown-final--city').value = addressLinesObject['CityLocality'];
        document.getElementById('typedown-final--state').value = addressLinesObject['StateProvince'];
        document.getElementById('typedown-final--postal-code').value = addressLinesObject['PostalCode'];
        document.getElementById('typedown-final--country-code').value = addressLinesObject['Three character ISO country code'];
        // Hide Result and Previous Suggestions
        document.getElementById('typedown-result').classList.add('dn');
        document.getElementById('typedown-previous-steps').classList.add('dn');
        document.getElementById('prompt-select').onclick = function (e) {
            updateValuesFromMapping(EDQ_CONFIG.PRO_WEB_MAPPING, createRawAddressMap(data.Envelope.Body.Address.QAAddress.AddressLine));
            removeModal();
        };
        document.getElementById('prompt-select').focus();
    }
    function removeModal() {
        document.getElementById('edq-overlay-container').remove();
    }
    /*
     * Updates the UI necessarily
     *
     * @param {Object} data
     *
     * @returns {Boolean}
     */
    function picklistUiUpdate(data) {
        // TODO: This is hacky, there should be a more comprehensive solution in place here.
        try {
            document.getElementById('prompt-text').innerHTML = data.Envelope.Body.QASearchResult.QAPicklist.Prompt;
        }
        catch (e) {
            try {
                document.getElementById('prompt-text').innerHTML = data.Envelope.Body.Picklist.QAPicklist.Prompt;
            }
            catch (e) {
                try {
                    document.getElementById('prompt-text').innerHTML = 'Please confirm the address';
                    return false;
                }
                catch (e) {
                    throw "There seems to be an error: " + e;
                }
            }
        }
        var picklists;
        // TODO: Handle the case where there's an error for whatever reason.
        try {
            picklists = data.Envelope.Body.QASearchResult.QAPicklist.PicklistEntry;
        }
        catch (e) {
            // This handles the case where it's in "refine" mode.
            // TODO: A try/catch may not be the best way to handle this. Fix this later
            picklists = data.Envelope.Body.Picklist.QAPicklist.PicklistEntry;
        }
        var picklistElement = generatePicklistElement(picklists);
        document.getElementById('typedown-result').innerHTML = picklistElement.outerHTML;
        document.getElementById('picklist-matches-count').innerHTML = String(picklistElement.children.length);
        return true;
    }
    /** Adds event listeners to the modal
     *
     * @param {Element} modalElement
     * @param {Event} newEvent
     *
     * @returns {undefined}
     */
    function addModalEvents(modalElement, newEvent) {
        modalElement.querySelector('#edq-close-modal').onclick = function () {
            document.querySelector('html').style.backgroundColor = '';
            modalElement.querySelector('#edq-modal-new').onclick();
            removeModal();
        };
        // Selection before 'final address' stage.
        modalElement.querySelector('#prompt-select').onclick = function () {
            modalElement.querySelector('#typedown-results').children[0].click();
        };
        modalElement.querySelector('#edq-modal-new').onclick = function () {
            document.getElementById('typedown-previous-steps').innerHTML = null;
            document.getElementById('typedown-final-address').classList.add('dn');
            document.getElementById('typedown-result').innerHTML = 'Continue typing (too many matches)';
            document.getElementById('typedown-result').classList.remove('dn');
            modalElement.querySelector('#prompt-text').innerHTML = 'Enter ZIP code, city name, county name or state code';
            modalElement.querySelector('#prompt-select').innerHTML = 'Select';
            modalElement.querySelector('#prompt-input').value = null;
            modalElement.querySelector('#prompt-input').removeAttribute('disabled');
            if (searchMethod) {
                searchMethod = verifier.doSearch;
            }
            if (getPicklistMoniker()) {
                setPicklistMoniker(null);
            }
            modalElement.querySelector('#prompt-input').focus();
        };
        modalElement.querySelector('#edq-modal-back').onclick = function () {
            if (userStates.stack.length === 0) {
                return;
            }
            userStates.revertPop();
        };
        var xhr;
        modalElement.querySelector('#prompt-input').onkeyup = function (event) {
            console.log("Prompt Input Moniker: " + getPicklistMoniker());
            // The purpose of this is to cancel any requests that are currently in progress.
            try {
                xhr.abort();
            }
            catch (e) {
                // pass
            }
            // <any> Says that the Object can by any type.
            // We want to combine our template parameters with the custom callback.
            xhr = searchMethod(Object.assign(getMethodParams(event, getPicklistMoniker()), {
                callback: function (data, error) {
                    if (error) {
                        return;
                    }
                    // There are picklists
                    if (picklistUiUpdate(data)) {
                        document.getElementById('typedown-results').onclick = function (newEvent) {
                            event.preventDefault();
                            // An event isn't necessarily an element so we cast it here.
                            var eventTarget = newEvent.target;
                            if (eventTarget.classList.contains('picklist-item')) {
                                var oldSearchMethod = searchMethod;
                                var oldPicklistMoniker = getPicklistMoniker();
                                var picklistMetaData = JSON.parse(eventTarget.getAttribute('picklist-metadata'));
                                if (!picklistMetaData.PartialAddress) {
                                    return;
                                }
                                else if (picklistMetaData._CanStep === "true") {
                                    searchMethod = verifier.doRefine;
                                    setPicklistMoniker(picklistMetaData.Moniker);
                                }
                                else if (picklistMetaData._FullAddress === "true") {
                                    searchMethod = verifier.doGetAddress;
                                    setPicklistMoniker(picklistMetaData.Moniker);
                                }
                                afterPicklistSelect.bind(userStateContext)(event, picklistMetaData, oldSearchMethod, oldPicklistMoniker);
                                return;
                            }
                        };
                        // There are no more picklists -- at final stage of selection process (full address)
                    }
                    else {
                        finalAddressUiUpdate(data);
                        searchMethod = verifier.doSearch;
                        setPicklistMoniker(null);
                    }
                }
            }));
        };
    }
    /*
     * @param {Array|Object} picklists
     *
     * @returns {Element}
     */
    function generatePicklistElement(picklists) {
        if (picklists.constructor == Object) {
            picklists = [picklists];
        }
        var resultElement = document.createElement('div');
        resultElement.id = 'typedown-results';
        picklists.forEach(function (picklist, index) {
            var element = document.createElement('a');
            element.setAttribute('picklist-metadata', JSON.stringify(picklist));
            element.href = "#";
            element.tabIndex = 0;
            element.innerText = picklist.Picklist;
            element.className = 'pointer shadow-hover picklist-item db link black';
            resultElement.appendChild(element);
        });
        return resultElement;
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
                    return rawAddress[addressElement];
                }).join(fieldElement.separator);
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
    EDQ_CONFIG.PRO_WEB_TYPEDOWN_TRIGGER.onclick = function (event) {
        event.preventDefault();
        openModal(createNewEvent(event));
    };
})();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UserState = /** @class */ (function () {
    function UserState(args, context) {
        this.args = args;
        this.context = context;
    }
    UserState.prototype._setDomState = function () {
        var args = this.args;
        document.getElementById('prompt-text').innerHTML = args['prompt text'];
        document.getElementById('prompt-input').value = args['input value'];
        document.getElementById('typedown-result').innerHTML = args['suggestions'];
        document.getElementById('typedown-previous-steps').innerHTML = args['previous suggestions'];
        ;
    };
    UserState.prototype._fullAddressReset = function () {
        var finalAddressElement = document.getElementById('typedown-final-address');
        if (!finalAddressElement.classList.contains('dn')) {
            document.getElementById('typedown-final-address').classList.add('dn');
            document.getElementById('typedown-result').classList.remove('dn');
            document.getElementById('typedown-previous-steps').classList.remove('dn');
            document.getElementById('prompt-input').removeAttribute('disabled');
        }
    };
    UserState.prototype._afterRevertStateFocus = function () {
        document.getElementById('prompt-input').focus();
        document.getElementById('prompt-input').dispatchEvent(new KeyboardEvent('keyup', { key: '' }));
    };
    UserState.prototype._setEventsPreviousSteps = function () {
        if (document.getElementById('typedown-previous-steps').children.length > 0) {
            for (var i = 0; i < document.getElementById('typedown-previous-steps').children.length; i++) {
                var child = document.getElementById('typedown-previous-steps').children[i];
                child.onclick = this.context._picklistSuggestionOnClick;
            }
        }
    };
    UserState.prototype.revertState = function () {
        var args = this.args;
        this._setDomState();
        this.context.setSearchMethod(args['search method']);
        this.context.setPicklistMoniker(args['moniker']);
        this._setEventsPreviousSteps();
        if (args['metadata']._FullAddress === 'true') {
            this._fullAddressReset();
        }
        this._afterRevertStateFocus();
    };
    return UserState;
}());
exports.UserState = UserState;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * A custom class that implements a queue.
 * In effect this is just a queue, with the caveat that
 * it has a "revertPop" method which does a pop, but also
 * reverts the state to the prior UserState, as well
 */
var UserStates = /** @class */ (function () {
    function UserStates() {
        this.stack = [];
    }
    UserStates.prototype.push = function (state) {
        this.stack.push(state);
    };
    ;
    UserStates.prototype.revertPop = function () {
        var userState = this.stack.pop();
        userState.revertState();
        return userState;
    };
    ;
    UserStates.prototype.pop = function () {
        var userState = this.stack.pop();
        return userState;
    };
    return UserStates;
}());
exports.UserStates = UserStates;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function modal() {
    return "<div class=\"edq-overlay\" id=\"edq-overlay\">\n      <div id=\"edq-modal\" class=\"w-75 center v-top v-mid-ns mt4-m mt6-l\">\n        <div class=\"bg-black-10\">\n          <!-- New/Back, Mode, and Datamap -->\n          <div class=\"pl3 pt3\">\n            <span>\n              <button id=\"edq-modal-new\" class=\"pointer pl1\">New</button>\n              <button id=\"edq-modal-back\" class=\"pointer pr1\">Back</button>\n            </span>\n\n            |\n\n            <input type=\"radio\" checked name=\"verification-mode\" value=\"typedown\">Typedown</input>\n\n            | Datamap:\n            <select>\n              <option>United States of America</option>\n            </select>\n\n            <span id=\"edq-close-modal\"\n                  class=\"bg-black b white pointer fr ba f5 ph1 mr3\">\n              x\n            </span>\n          </div>\n\n          <div class=\"pa2 bb b--black-10\"></div>\n\n          <!-- Prompt and selection field -->\n          <div class=\"pl3 mt3 pb3\">\n            <div id=\"prompt-text\" class=\"b\">Enter ZIP code, city name, county name or state code</div>\n            <input id=\"prompt-input\">\n            <button id=\"prompt-select\" class=\"pointer\">Select</button>\n          </div>\n        </div>\n\n        <!-- Current steps -->\n        <div id=\"typedown-steps\" class=\"h5 ba\">\n          <div id=\"typedown-previous-steps\">\n          </div>\n\n          <div id=\"typedown-result\" class=\"ml4\">\n            Continue typing (too many matches)\n          </div>\n\n          <div id=\"typedown-final-address\" class=\"ml4 dn\">\n            <div>\n              <span class=\"dib w-10\">Address Line One</span>\n              <span class=\"dib w-80\"><input class=\"w-100\" id=\"typedown-final--address-line-one\"></span>\n            </div>\n            <div>\n              <span class=\"dib w-10\">Address Line Two</span>\n              <input class=\"dib w-80\" id=\"typedown-final--address-line-two\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">City</span>\n              <input class=\"dib w-80\" id=\"typedown-final--city\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">State</span>\n              <input class=\"dib w-80\" id=\"typedown-final--state\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">Postal Code</span>\n              <input class=\"dib w-80\" id=\"typedown-final--postal-code\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">Country Code</span>\n              <input class=\"dib w-80\" id=\"typedown-final--country-code\">\n            </div>\n          </div>\n        </div>\n\n        <!-- Number of matches -->\n        <div class=\"cf bg-black-10\">\n          <span class=\"fr mr5\">| Matches: <span id=\"picklist-matches-count\">1</span></span>\n        </div>\n      </div>";
}
exports.modal = modal;
;


/***/ }),
/* 4 */
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