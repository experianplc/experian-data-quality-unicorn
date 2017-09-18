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
  function UserState({ui = null, fn = null, args, self = null}) {
    this.ui = ui;
    this.fn = fn;
    this.args = args;
    this.self = self;
  }

  UserState.prototype = {
    revertState: function() {
      let args = this.args;
      document.getElementById('prompt-text').innerHTML = args['prompt text'] ;
      document.getElementById('prompt-input').value = args['input value'];
      document.getElementById('typedown-result').innerHTML = args['suggestions'];

      let typedownPreviousSteps = document.getElementById('typedown-previous-steps');
      typedownPreviousSteps.innerHTML = args['previous suggestions'];

      searchMethod = args['search method'];
      picklistMoniker = args['moniker'];
      let metadata = args['metadata'];

      if (document.getElementById('typedown-previous-steps').children.length > 0) {
        for (let i = 0; i < document.getElementById('typedown-previous-steps').children.length; i++ ) {
          let child = document.getElementById('typedown-previous-steps').children[i];
          child.onclick = _picklistSuggestionOnClick;
        }
      }

      if (metadata._FullAddress === 'true') {
        let finalAddressElement = document.getElementById('typedown-final-address');
        if (!finalAddressElement.classList.contains('dn')) {
          document.getElementById('typedown-final-address').classList.add('dn');
          document.getElementById('typedown-result').classList.remove('dn');
          document.getElementById('typedown-previous-steps').classList.remove('dn');
          document.getElementById('prompt-input').removeAttribute('disabled');
        }
      }

      // After State Reversion
      document.getElementById('prompt-input').focus();
      document.getElementById('prompt-input').dispatchEvent(new KeyboardEvent('keyup', { key: '' }));
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
    revertPop: function() {
      let temp = this.stack.pop();
      temp.revertState();
      return temp;
    },

    pop: function() {
      let temp = this.stack.pop();
      return temp;
    }
  };


  // Scoped variables
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

  let userStates = new UserStates();

  /* The template for the modal */
  function modalHtml() {
    return `<div class="edq-overlay" id="edq-overlay">
      <div class="w-75 center v-top v-mid-ns mt4-m mt6-l">
        <div class="bg-black-10">
          <!-- New/Back, Mode, and Datamap -->
          <div class="pl3 pt3">
            <span>
              <button id="edq-modal-new" class="pointer pl1">New</button>
              <button id="edq-modal-back" class="pointer pr1">Back</button>
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
            <div id="prompt-text" class="b">Enter ZIP code, city name, county name or state code</div>
            <input id="prompt-input">
            <button id="prompt-select" class="pointer">Select</button>
          </div>
        </div>

        <!-- Current steps -->
        <div class="h5 ba">
          <div id="typedown-previous-steps">
          </div>

          <div id="typedown-result" class="ml4">
            Continue typing (too many matches)
          </div>

          <div id="typedown-final-address" class="ml4 dn">
            <div>
              <span class="dib w-10">Address Line One</span>
              <span class="dib w-80"><input class="w-100" id="typedown-final--address-line-one"></span>
            </div>
            <div>
              <span class="dib w-10">Address Line Two</span>
              <input class="dib w-80" id="typedown-final--address-line-two">
            </div>
            <div>
              <span class="dib w-10">City</span>
              <input class="dib w-80" id="typedown-final--city">
            </div>
            <div>
              <span class="dib w-10">State</span>
              <input class="dib w-80" id="typedown-final--state">
            </div>
            <div>
              <span class="dib w-10">Postal Code</span>
              <input class="dib w-80" id="typedown-final--postal-code">
            </div>
            <div>
              <span class="dib w-10">Country Code</span>
              <input class="dib w-80" id="typedown-final--country-code">
            </div>
          </div>
        </div>

        <!-- Number of matches -->
        <div class="cf bg-black-10 h-100">
          <span class="fr mr5">| Matches: <span id="picklist-matches-count">1</span></span>
        </div>
      </div>`;
  };

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

    let modalElement = document.createElement('div');
    modalElement.id = 'edq-overlay-container';
    modalElement.innerHTML = modalHtml();
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
   * Generates method parameters for the Typedown searches
   *
   * @param {Event} event
   * @param {String} moniker
   *
   * @returns Object - method parameters
   */
  function getMethodParams(event=null, moniker=null) {
    let layout = EDQ_CONFIG.PRO_WEB_LAYOUT;

    // doRefine
    if (event && moniker) {
      return {
        country: 'USA',
        refineOptions: {},
        layout,
        moniker,
        refinement: event.target.value,
        formattedAddressInPicklist: false
      }
      // doSearch
    } else if (event && !moniker) {
      return {
        country: EDQ_CONFIG.PRO_WEB_COUNTRY, /* ISO-3 Country, e.g. USA */
        addressQuery: event.target.value,
        engineOptions: {},
        engineType: 'Typedown',
        layout,
        formattedAddressInPicklist: false,
      }
      // doGetAddress
    } else if (!event && moniker) {
      return {
        moniker,
        layout
      }
    }
  }

  /*
   * Handles the actions, including DOM updates after picklist selection
   *
   */
  function afterPicklistSelect(event : KeyboardEvent,
    picklistMetaData : PicklistObject,
    oldSearchMethod : Function,
    oldPicklistMoniker: string) {

    let previousTypedownSteps = document.getElementById('typedown-previous-steps');
    let previousSuggestion = generatePicklistSuggestion(picklistMetaData);

    let newState = new UserState({
      args: {
        'engine': '',
        'country': '',
        'prompt text': document.getElementById('prompt-text').innerHTML,
        'input value': document.getElementById('prompt-input').value,
        'suggestions': document.getElementById('typedown-result').innerHTML,
        'previous suggestions': document.getElementById('typedown-previous-steps').innerHTML,
        'search method': oldSearchMethod,
        'event': event,
        'moniker': oldPicklistMoniker,
        'metadata': picklistMetaData
      }
    });

    // An EventTarget doesn't necessarily have the property value, so TypeScript is throwing an
    // error here. Casting this to an HTMLInputElement will solve the problem in this case.
    const htmlEventTarget = <HTMLInputElement>event.target
    htmlEventTarget.onkeyup(event);
    htmlEventTarget.value = null;

    document.getElementById('typedown-previous-steps').appendChild(previousSuggestion);
    userStates.push(newState);
    document.getElementById('prompt-input').focus();
  }

  /*
   * Generates a picklist suggestion element to be appended to the history
   */
  function generatePicklistSuggestion(picklistMetaData : PicklistObject): Element {
    let previousSuggestion = document.createElement('div');
    let initialPaddingOffset = 1; // rem
    previousSuggestion.style.paddingLeft = `${document.getElementById('typedown-previous-steps').children.length + initialPaddingOffset}rem`;
    previousSuggestion.innerHTML = picklistMetaData.Picklist;
    previousSuggestion.className = 'pointer shadow-hover picklist-item';
    previousSuggestion.setAttribute('picklist-metadata', JSON.stringify(picklistMetaData));
    previousSuggestion.onclick = _picklistSuggestionOnClick;
    return previousSuggestion;
  }

  function _picklistSuggestionOnClick(event : MouseEvent) {
    let metadata = JSON.parse((<Element>event.target).getAttribute('picklist-metadata'));

    for (let index = 0; index < userStates.stack.length; index++) {
      let item = userStates.stack[index];

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
    const addressLinesObject = createRawAddressMap(data.Envelope.Body.Address.QAAddress.AddressLine);

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

    document.getElementById('prompt-select').onclick = function(e) {
      updateValuesFromMapping(
        EDQ_CONFIG.PRO_WEB_MAPPING,
        createRawAddressMap(data.Envelope.Body.Address.QAAddress.AddressLine)
      );

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
    } catch(e) {
      try {
        document.getElementById('prompt-text').innerHTML = data.Envelope.Body.Picklist.QAPicklist.Prompt;
      }
      catch(e) {
        try {
          document.getElementById('prompt-text').innerHTML = 'Please confirm the address';
          return false;
        } catch(e) {
          throw `There seems to be an error: ${e}`;
        }
      }
    }

    let picklists;
    // TODO: Handle the case where there's an error for whatever reason.
    try {
      picklists = data.Envelope.Body.QASearchResult.QAPicklist.PicklistEntry
    } catch(e) {

      // This handles the case where it's in "refine" mode.
      // TODO: A try/catch may not be the best way to handle this. Fix this later
      picklists = data.Envelope.Body.Picklist.QAPicklist.PicklistEntry;
    }

    const picklistElement = generatePicklistElement(picklists);
    document.getElementById('typedown-result').innerHTML = picklistElement.outerHTML;
    document.getElementById('picklist-matches-count').innerHTML = String(picklistElement.children.length);
    return true;
  }

  // This is an anti-pattern, but is conveninent for an application of this size. 
  // Global Variables:
  let picklistMoniker = null;
  let searchMethod = verifier.doSearch;


  /** Adds event listeners to the modal
   *
   * @param {Element} modalElement
   * @param {Event} newEvent
   *
   * @returns {undefined}
   */
  function addModalEvents(modalElement, newEvent) {
    modalElement.querySelector('#edq-close-modal').onclick = function() {
      modalElement.querySelector('#edq-modal-new').onclick();
      removeModal();
    };

    // Selection before 'final address' stage.
    modalElement.querySelector('#prompt-select').onclick = function() {
      modalElement.querySelector('#typedown-results').children[0].click();
    };

    modalElement.querySelector('#edq-modal-new').onclick = function() {
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

      if (picklistMoniker) {
        picklistMoniker = null;
      }

      modalElement.querySelector('#prompt-input').focus();
    }

    modalElement.querySelector('#edq-modal-back').onclick = function() {
      if (userStates.stack.length === 0) {
        return;
      }

      userStates.revertPop();
    }

    let xhr;
    modalElement.querySelector('#prompt-input').onkeyup = function(event) {

      // The purpose of this is to cancel any requests that are currently in progress.
      try {
        xhr.abort();
      } catch(e) {
        // pass
      }

      // Enter was pressed
      if (event.keyCode === 13) {
        modalElement.querySelector('#prompt-select').click();
        return;
      }

      // <any> Says that the Object can by any type.
      // We want to combine our template parameters with the custom callback.
      xhr = searchMethod((<any>Object).assign(getMethodParams(event, picklistMoniker), {
        callback: function(data, error) {
          if (error) {
            return;
          }

          // There are picklists
          if (picklistUiUpdate(data)) {
            document.getElementById('typedown-results').onclick = function(newEvent) {
              // An event isn't necessarily an element so we cast it here.
              let eventTarget = (<Element>newEvent.target);

              if (eventTarget.classList.contains('picklist-item')) {
                let oldSearchMethod = searchMethod;
                let oldPicklistMoniker = picklistMoniker;

                let picklistMetaData = JSON.parse(eventTarget.getAttribute('picklist-metadata'));

                if (!picklistMetaData.PartialAddress) {
                  return;

                } else if (picklistMetaData._CanStep === "true") {
                  searchMethod = verifier.doRefine;
                  picklistMoniker = picklistMetaData.Moniker;

                } else if (picklistMetaData._FullAddress === "true") {
                  searchMethod = verifier.doGetAddress;
                  picklistMoniker = picklistMetaData.Moniker;
                }

                afterPicklistSelect(event, picklistMetaData, oldSearchMethod, oldPicklistMoniker);
                return;
              }
            };

          // There are no more picklists -- at final stage of selection process (full address)
          } else {
            finalAddressUiUpdate(data);
            searchMethod = verifier.doSearch;
            picklistMoniker = null;
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

    let resultElement = document.createElement('div');
    resultElement.id = 'typedown-results';

    picklists.forEach((picklist) => {
      let element = document.createElement('div');
      element.setAttribute('picklist-metadata', JSON.stringify(picklist));
      element.tabIndex = 0;
      element.innerText = picklist.Picklist;
      element.className = 'pointer shadow-hover picklist-item';
      element.onkeyup = function(event) {
        // If 'Enter' is not selected.
        if (event.keyCode !== 13) {
          return;
        }

        let eventTarget = (<Element>event.target);
        let oldSearchMethod = searchMethod;
        let oldPicklistMoniker = picklistMoniker;

        let picklistMetaData = JSON.parse(eventTarget.getAttribute('picklist-metadata'));

        if (!picklistMetaData.PartialAddress) {
          return;

        } else if (picklistMetaData._CanStep === "true") {
          searchMethod = verifier.doRefine;
          picklistMoniker = picklistMetaData.Moniker;

        } else if (picklistMetaData._FullAddress === "true") {
          searchMethod = verifier.doGetAddress;
          picklistMoniker = picklistMetaData.Moniker;
        }

        afterPicklistSelect(event, picklistMetaData, oldSearchMethod, oldPicklistMoniker);
        return;
      }

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
