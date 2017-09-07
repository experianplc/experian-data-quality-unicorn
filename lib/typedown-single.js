(function () {
    /* UserState represents the state of both the UI at the time and the "back-end", which
     * consists of things like the function used for search and the parameters */
    /*
     *
     * @param {HTML} ui - the HTML that was present at that step, e.g. picklists after doSearch
     * @param {Function} fn - the type of function used for verification, e.g. doSearch or doRefine
     * @param {Object} args - arguments to be used after initial search, e.g. a moniker.
     * @param {Object} self - reference to the original self.
     */
    function UserState(ui, fn, args, self) {
        this.ui = ui;
        this.fn = fn;
        this.args = args;
        this.self = self;
    }
    UserState.prototype = {
        revertState: function () {
        }
    };
    function UserStates() {
        this.stack = [];
    }
    UserStates.prototype = {
        /*
         * @param {UserState} state
         *
         * @returns {undefined}
         */
        push: function (state) {
            this.stack.push(state);
        },
        /*
         * @returns {UserState}
         */
        pop: function () {
            var temp = this.stack.pop();
            temp.revertState();
            return temp;
        }
    };
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
    function modalHtml() {
        return "<div class=\"edq-overlay\" id=\"edq-overlay\">\n      <div class=\"w-75 center v-top v-mid-ns mt4-m mt6-l\">\n        <div class=\"bg-black-10\">\n          <!-- New/Back, Mode, and Datamap -->\n          <div class=\"pl3 pt3\">\n            <span>\n              <button id=\"edq-modal-new\" class=\"pointer pl1\">New</button>\n              <button id=\"edq-modal-back\" class=\"pointer pr1\">Back</button>\n            </span>\n\n            |\n\n            <input type=\"radio\" name=\"verification-mode\" value=\"typedown\">Typedown</input>\n            <input type=\"radio\" name=\"verification-mode\" value=\"single-line\">Single Line</input>\n\n            | Datamap:\n            <select>\n              <option>United States of America</option>\n              <option>Canada</option>\n            </select>\n\n            <span id=\"edq-close-modal\"\n                  class=\"bg-black b white pointer fr ba f5 ph1 mr3\">\n              x\n            </span>\n          </div>\n\n          <div class=\"pa2 bb b--black-10\"></div>\n\n          <!-- Prompt and selection field -->\n          <div class=\"pl3 mt3 pb3\">\n            <div id=\"prompt-text\" class=\"b\">Enter ZIP code, city name, county name or state code</div>\n            <input id=\"prompt-input\">\n            <button id=\"prompt-select\" class=\"pointer\">Select</button>\n          </div>\n        </div>\n\n        <!-- Current steps -->\n        <div class=\"h5 ba\">\n          <div id=\"typedown-previous-steps\">\n          </div>\n\n          <div id=\"typedown-final-address\" class=\"ml4 dn\">\n            <div>\n              <span class=\"dib w-10\">Address Line One</span>\n              <span class=\"dib w-80\"><input class=\"w-100\" id=\"typedown-final--address-line-one\"></span>\n            </div>\n            <div>\n              <span class=\"dib w-10\">Address Line Two</span>\n              <input class=\"dib w-80\" id=\"typedown-final--address-line-two\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">City</span>\n              <input class=\"dib w-80\" id=\"typedown-final--city\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">State</span>\n              <input class=\"dib w-80\" id=\"typedown-final--state\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">Postal Code</span>\n              <input class=\"dib w-80\" id=\"typedown-final--postal-code\">\n            </div>\n            <div>\n              <span class=\"dib w-10\">Country Code</span>\n              <input class=\"dib w-80\" id=\"typedown-final--country-code\">\n            </div>\n          </div>\n\n          <div id=\"typedown-result\" class=\"ml4\">\n            Continue typing (too many matches)\n          </div>\n        </div>\n\n        <!-- Number of matches -->\n        <div class=\"cf bg-black-10 h-100\">\n          <span class=\"fr mr5\">| Matches: <span id=\"picklist-matches-count\">1</span></span>\n        </div>\n      </div>";
    }
    ;
    /** Closes the modal by removing it from the DOM
     *
     * @returns {undefined}
     */
    function closeModal() {
        document.getElementById('edq-overlay-container').remove();
    }
    /** Creates the modal and adds it to the DOM
     *
     * @returns {Element}
     */
    function openModal(newEvent) {
        if (document.getElementById('edq-overlay-container')) {
            return document.getElementById('edq-overlay-container');
        }
        var modalElement = document.createElement('div');
        modalElement.id = 'edq-overlay-container';
        modalElement.innerHTML = modalHtml();
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
    var searchMethod = verifier.doSearch;
    /*
     * Generates method parameters for the Typedown searches
     *
     * @param {Event} event
     * @param {String} moniker
     *
     * @returns Object - method parameters
     */
    function getMethodParams(event, moniker) {
        if (event === void 0) { event = null; }
        if (moniker === void 0) { moniker = null; }
        var layout = EDQ_CONFIG.PRO_WEB_LAYOUT;
        // doRefine
        if (event && moniker) {
            return {
                country: 'USA',
                refineOptions: {},
                layout: layout,
                moniker: moniker,
                refinement: event.target.value,
                formattedAddressInPicklist: false
            };
            // doSearch
        }
        else if (event && !moniker) {
            return {
                country: EDQ_CONFIG.PRO_WEB_COUNTRY,
                addressQuery: event.target.value,
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
     * @param {KeyboardEvent} event
     * @param {PicklistObject} picklistMetaData
     *
     * @returns {undefined}
     */
    function afterPicklistSelect(event, picklistMetaData) {
        console.log(picklistMetaData);
        // An EventTarget doesn't necessarily have the property value, so TypeScript is throwing an
        // error here. Casting this to an HTMLInputElement will solve the problem in this case.
        var htmlEventTarget = event.target;
        htmlEventTarget.onkeyup(event);
        htmlEventTarget.value = null;
        // TODO: give it padding slightly more of the previous suggestion or a default
        var previousSuggestion = document.createElement('div');
        previousSuggestion.innerHTML = picklistMetaData.Picklist;
        previousSuggestion.onclick = function (e) {
            // make it clickable to go back to that step (work in progress)
        };
        document.getElementById('typedown-previous-steps').appendChild(previousSuggestion);
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
        document.getElementById('typedown-final--address-line-one').value = addressLinesObject['AddressLine1'];
        document.getElementById('typedown-final--address-line-two').value = addressLinesObject['AddressLine2'];
        document.getElementById('typedown-final--city').value = addressLinesObject['CityLocality'];
        document.getElementById('typedown-final--state').value = addressLinesObject['StateProvince'];
        document.getElementById('typedown-final--postal-code').value = addressLinesObject['PostalCode'];
        document.getElementById('typedown-final--country-code').value = addressLinesObject['Three character ISO country code'];
        document.getElementById('typedown-final-address').classList.remove('dn');
        document.getElementById('typedown-result').classList.add('dn');
        document.getElementById('prompt-select').addEventListener('click', function (e) {
            updateValuesFromMapping(EDQ_CONFIG.PRO_WEB_MAPPING, createRawAddressMap(data.Envelope.Body.Address.QAAddress.AddressLine));
            removeModal();
        });
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
            removeModal();
        };
        modalElement.querySelector('#edq-modal-new').onclick = function () {
            document.getElementById('typedown-previous-steps').innerHTML = null;
            document.getElementById('typedown-final-address').classList.add('dn');
            document.getElementById('typedown-result').innerHTML = 'Continue typing (too many matches)';
            document.getElementById('typedown-result').classList.remove('dn');
            modalElement.querySelector('#prompt-text').innerHTML = 'Enter ZIP code, city name, county name or state code';
            modalElement.querySelector('#prompt-select').innerHTML = 'Select';
            modalElement.querySelector('#prompt-input').value = null;
            if (searchMethod) {
                searchMethod = verifier.doSearch;
            }
            if (picklistMoniker) {
                picklistMoniker = null;
            }
        };
        modalElement.querySelector('#edq-modal-back').onclick = function () {
        };
        var xhr;
        var picklistMoniker = null;
        modalElement.querySelector('#prompt-input').onkeyup = function (event) {
            // The purpose of this is to cancel any requests that are currently in progress.
            try {
                xhr.abort();
            }
            catch (e) {
                // pass
            }
            // <any> Says that the Object can by any type.
            // We want to combine our template parameters with the custom callback.
            xhr = searchMethod(Object.assign(getMethodParams(event, picklistMoniker), {
                callback: function (data, error) {
                    if (error) {
                        return;
                    }
                    // There are picklists
                    if (picklistUiUpdate(data)) {
                        document.getElementById('typedown-result').onclick = function (newEvent) {
                            // An event isn't necessarily an element so we cast it here.
                            var eventTarget = newEvent.target;
                            if (eventTarget.classList.contains('picklist-item')) {
                                var picklistMetaData = JSON.parse(eventTarget.getAttribute('picklist-metadata'));
                                if (!picklistMetaData.PartialAddress) {
                                    return;
                                }
                                else if (picklistMetaData._CanStep === "true") {
                                    searchMethod = verifier.doRefine;
                                    picklistMoniker = picklistMetaData.Moniker;
                                }
                                else if (picklistMetaData._FullAddress === "true") {
                                    searchMethod = verifier.doGetAddress;
                                    picklistMoniker = picklistMetaData.Moniker;
                                }
                                afterPicklistSelect(event, picklistMetaData);
                                return;
                            }
                        };
                        // There are no more picklists -- at final stage of selection process.
                    }
                    else {
                        finalAddressUiUpdate(data);
                        // Reset searchMethod and other information back to their original:
                        searchMethod = verifier.doSearch;
                        picklistMoniker = null;
                    }
                }
            }));
            // Every time you change anything run the queries
            // After new queries are generateed create new suggestions.
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
        picklists.forEach(function (picklist) {
            var element = document.createElement('div');
            element.setAttribute('picklist-metadata', JSON.stringify(picklist));
            element.innerText = picklist.Picklist;
            element.className = 'pointer shadow-hover picklist-item';
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
                setStateSelectedIndex(fieldElement.field, rawAddress[fieldElement.elements[0]]);
                return;
            }
            fieldElement.field.value
                = fieldElement.elements.map(function (addressElement) {
                    return rawAddress[addressElement];
                }).join(fieldElement.separator);
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
}).call(this);