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
    revertState: function() {
    }
  };

  function UserStates() {
    this.stack = []
  }

  UserStates.prototype = {

    /*
     * @param {UserState} state
     *
     * @returns {undefined}
     */
    push: function(state) {
      this.stack.push(state);
    },

    /*
     * @returns {UserState}
     */
    pop: function() {
      let temp = this.stack.pop();
      temp.revertState();
      return temp;
    }
  };


  const EDQ_CONFIG = <UnicornObject> window.EdqConfig || <UnicornObject> {};
  let EDQ;
  if (window.EDQ) {
    EDQ = window.EDQ;
  } else {
    throw 'Please make sure that EDQ Pegasus is included in your HTML before EDQ Unicorn.';
  }

  let verifier = EDQ.address.proWebOnDemand;
  if (EDQ_CONFIG.PRO_WEB_SERVICE_URL) {
    verifier = EDQ.address.proWeb;
  }

  /* The template for the modal */
  const modalHtml = function() {
    return `<div class="edq-overlay" id="edq-overlay">
      <div class="w-75 center v-top v-mid-ns mt4-m mt6-l">
        <div class="bg-black-10">
          <!-- New/Back, Mode, and Datamap -->
          <div class="pl3 pt3">
            <span>
              <button class="pointer pl1">New</button>
              <button class="pointer pr1">Back</button>
            </span>

            |

            <input type="radio" name="verification-mode" value="typedown">Typedown</input>
            <input type="radio" name="verification-mode" value="single-line">Single Line</input>

            | Datamap:
            <select>
              <option>United States of America</option>
              <option>Canada</option>
            </select>

            <span id="edq-close-modal"
              class="bg-black b white pointer fr ba f5 ph1 mr3">
              x
            </span>
          </div>

          <div class="pa2 bb b--black-10"></div>

          <!-- Prompt and selection field -->
          <div class="pl3 mt3 pb3">
            <div id="b f1">Enter ZIP code, city name, county name, or state code</div>
            <input id="prompt-input">
            <button class="pointer">Select</button>
          </div>
        </div>

        <!-- Current steps -->
        <div class="h5 ba">
          <div id="typedown-result" class="ml4">
            Continue typing (too many matches)
          </div>
        </div>

        <!-- Number of matches -->
        <div class="cf bg-black-10 h-100">
          <span class="fr mr5">| Matches: 1</span>
        </div>
      </div>`;
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
    const suggestionBox = document.querySelector('#edq-verification-suggestion-box');
    if (suggestionBox) {
      suggestionBox.remove();
    }
  }

  /** Creates the modal and adds it to the DOM
   *
   * @returns {Element}
   */
  function openModal(newEvent) {
    if (document.getElementById('edq-overlay-container')) {
      return document.getElementById('edq-overlay-container');
    }

    let modalElement = document.createElement('div');
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


  let searchMethod = verifier.doSearch;
  let methodParams = {
    country: EDQ_CONFIG.PRO_WEB_COUNTRY, /* ISO-3 Country, e.g. USA */
    engineOptions: {},
    engineType: 'Typedown',
    layout: EDQ_CONFIG.PRO_WEB_LAYOUT,
    formattedAddressInPicklist: false,
  }

  /** Adds event listeners to the modal
   *
   * @param {Element} modalElement
   * @param {Event} newEvent
   *
   * @returns {undefined}
   */
  function addModalEvents(modalElement, newEvent) {
    modalElement.querySelector('#edq-close-modal').onclick= function() {
      modalElement.remove();
      const suggestionBox = document.querySelector('#edq-verification-suggestion-box');
      if (suggestionBox) {
        suggestionBox.remove();
      }
    };

    let xhr;
    modalElement.querySelector('#prompt-input').onkeypress = function(event) {

      try {
        xhr.abort();
      } catch(e) {
        // Pass
      }

      // <any> Says that the Object can by any type.
      xhr = searchMethod((<any>Object).assign(methodParams, {
        addressQuery: event.target.value,
        callback: function(data, error) {
          if (error) {
            return;
          }


          document.getElementById('typedown-result').innerHTML = generatePicklistElement(data).outerHTML;
          document.getElementById('typedown-result').addEventListener('click', function(newEvent) {

            // An event isn't necessarily an element so we cast it here.
            let eventTarget = (<Element>newEvent.target);

            if (eventTarget.classList.contains('picklist-item')) {
              let picklistMetaData = JSON.parse(eventTarget.getAttribute('picklist-metadata'));
              if (picklistMetaData._CanStep) {
                // Change the searchMethod to be refine.
                // Update the prompt
                searchMethod = verifier.doRefine;
              } else {
                // Change the searchMethod to getAddress
                // Update the prompt
                searchMethod = verifier.doGetAddress;
              }
            }
          });
        }
      }));

      // Every time you change anything run the queries
      // After new queries are generateed create new suggestions.
    };
  }


  /*
   * @param {Object} data
   *
   * @returns {Element}
   */
  function generatePicklistElement(data) {
    // TODO: Handle the case where there's an error for whatever reason.
    let picklists = data.Envelope.Body.QASearchResult.QAPicklist.PicklistEntry
    if (picklists.constructor == Object) {
      picklists = [picklists];
    }

    let resultElement = document.createElement('div');
    picklists.forEach((picklist) => {
      let element = document.createElement('div');
      element.setAttribute('picklist-metadata', JSON.stringify(picklist));
      element.innerText = picklist.Picklist;
      element.className = 'pointer dim picklist-item';
      resultElement.appendChild(element);
    });

    return resultElement
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
    let originalTarget = newEvent['originalTarget'];
    let callback = EDQ_CONFIG.PRO_WEB_CALLBACK;
    if (callback) {
      if (typeof(callback) === "string") {
        eval(callback);
      } else if (typeof(callback) === "function") {
        callback(newEvent.originalTarget, newEvent);
      } else {
        throw "PRO_WEB_CALLBACK must be either text resolving to javascript or a function";
      }

    } else {
      // Reverting the element changes appears to make things a bit easier.
      originalTarget[`on${newEvent.type}`] = newEvent['originalEvent'];
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
    let returnObject = {}
    soapObject.forEach((addressLine) => {
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
    mappings.forEach((fieldElement) => {
      if (fieldElement.field.tagName === "SELECT") {
        setStateSelectedIndex(fieldElement.field, rawAddress[fieldElement.elements[0]]);
        return;
      }

      fieldElement.field.value
        = fieldElement.elements.map((addressElement) => {
          return rawAddress[addressElement];
        }).join(fieldElement.separator);
    });

  }

  /** Displays the original address
   *
   * @returns {undefined}
   */
  function displayOriginalAddress() {
    EDQ_CONFIG.PRO_WEB_MAPPING.forEach((mapper) => {
      try {
        document.querySelector(mapper.modalFieldSelector).innerText = mapper.field.value;
      } catch(e) {
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
    let stateIndexMap = {};
    for (let i = 0; i < field.length; i++) {
      stateIndexMap[field.children[i].innerText.toLowerCase()] = field.children[i].index;
    }

    // TODO: Support other places other than the United States
    const us_states_abbr_to_full =  {
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

    const us_states_full_to_abbr = {
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

    const lowerCaseValue = value.toLowerCase();
    if (us_states_full_to_abbr[lowerCaseValue]) {
      field.selectedIndex = [stateIndexMap[us_states_full_to_abbr[lowerCaseValue]]];
    } else if (us_states_abbr_to_full[lowerCaseValue]) {
      field.selectedIndex = [stateIndexMap[lowerCaseValue]];
    }
  }

  /** Functionality for what should occur after a phone press
   *
   * @returns {undefined}
   */
  function submitForm(newEvent) {
    let addressQuery = EDQ_CONFIG.PRO_WEB_MAPPING.map(function(element) {
      return element.field.value || element.field.innerText;
    }).join(',');

    let xhr = verifier.doSearch({
      country: EDQ_CONFIG.PRO_WEB_COUNTRY, /* ISO-3 Country, e.g. USA */
      engineOptions: {},
      engineType: 'Verification',
      layout: EDQ_CONFIG.PRO_WEB_LAYOUT,
      addressQuery,
      formattedAddressInPicklist: false,

      callback: function(data, error) {
        if (error) {
          finalCallback(newEvent);
          return;
        }
      }
    });

    try {
      xhr.timeout = EDQ_CONFIG.PRO_WEB_TIMEOUT || 2500;
    } catch(e) {
      // Pass the internet explorer error
    }

  };

  EDQ_CONFIG.PRO_WEB_TYPEDOWN_TRIGGER.onclick = function(event) {
    event.preventDefault();
    openModal(createNewEvent(event));
  };
}).call(this);
