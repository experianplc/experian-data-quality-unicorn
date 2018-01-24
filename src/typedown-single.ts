import { UserState } from './classes/user-state';
import { UserStates } from './classes/user-states';
import { modal } from './functions/typedown-modal';
import { stateMapper } from './functions/state-mapper';

(function() {

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

  let picklistMoniker = null;
  let searchMethod = verifier.doSearch;


  function setPicklistMoniker(value) {
    picklistMoniker = value;
  };

  function getPicklistMoniker() {
    return picklistMoniker;
  };

  function setSearchMethod(value) {
    searchMethod = value;
  }

  function getSearchMethod() {
    return searchMethod;
  }

  const userStateContext = {
    setPicklistMoniker,
    setSearchMethod,
    _picklistSuggestionOnClick
  }

  function openModal(newEvent): Element {
    if (document.getElementById('edq-overlay-container')) {
      return document.getElementById('edq-overlay-container');
    }

    document.querySelector('html').style.backgroundColor = 'grey';

    let modalElement = document.createElement('div');
    modalElement.id = 'edq-overlay-container';
    modalElement.innerHTML = modal();
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
  function createNewEvent(oldEvent): Event {
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
  function getMethodParams(event?: Event, moniker?: String): Object {
    let layout = EDQ_CONFIG.PRO_WEB_LAYOUT;
    const eventTarget = <HTMLInputElement>event.target

    // doRefine
    if (event && moniker) {
      return {
        country: 'USA',
        refineOptions: {},
        layout,
        moniker,
        refinement: eventTarget.value,
        formattedAddressInPicklist: false
      }

    // doSearch
    } else if (event && !moniker) {
      return {
        country: EDQ_CONFIG.PRO_WEB_COUNTRY, /* ISO-3 Country, e.g. USA */
        addressQuery: eventTarget.value,
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
    let previousSuggestion = document.createElement('a');
    let initialPaddingOffset = 1; // rem
    previousSuggestion.style.paddingLeft = `${document.getElementById('typedown-previous-steps').children.length + initialPaddingOffset}rem`;
    previousSuggestion.innerHTML = picklistMetaData.Picklist;
    previousSuggestion.className = 'pointer shadow-hover picklist-item db link black';
    previousSuggestion.href = '#';
    previousSuggestion.tabIndex = 0;
    previousSuggestion.setAttribute('picklist-metadata', JSON.stringify(picklistMetaData));
    previousSuggestion.onclick = _picklistSuggestionOnClick;
    return previousSuggestion;
  }

  function _picklistSuggestionOnClick(event : MouseEvent) {
    event.preventDefault();

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

  /** Adds event listeners to the modal
   *
   * @param {Element} modalElement
   * @param {Event} newEvent
   *
   * @returns {undefined}
   */
  function addModalEvents(modalElement, newEvent) {
    modalElement.querySelector('#edq-close-modal').onclick = function() {
      document.querySelector('html').style.backgroundColor = '';
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

      if (getPicklistMoniker()) {
        setPicklistMoniker(null);
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
      console.log(`Prompt Input Moniker: ${getPicklistMoniker()}`);
      // The purpose of this is to cancel any requests that are currently in progress.
      try {
        xhr.abort();
      } catch(e) {
        // pass
      }

      // <any> Says that the Object can by any type.
      // We want to combine our template parameters with the custom callback.
      xhr = searchMethod((<any>Object).assign(getMethodParams(event, getPicklistMoniker()), {
        callback: function(data, error) {
          if (error) {
            return;
          }

          // There are picklists
          if (picklistUiUpdate(data)) {
            document.getElementById('typedown-results').onclick = function(newEvent) {
              event.preventDefault();

              // An event isn't necessarily an element so we cast it here.
              let eventTarget = (<Element>newEvent.target);

              if (eventTarget.classList.contains('picklist-item')) {
                let oldSearchMethod = searchMethod;
                let oldPicklistMoniker = getPicklistMoniker();

                let picklistMetaData = JSON.parse(eventTarget.getAttribute('picklist-metadata'));

                if (!picklistMetaData.PartialAddress) {
                  return;

                } else if (picklistMetaData._CanStep === "true") {
                  searchMethod = verifier.doRefine;
                  setPicklistMoniker(picklistMetaData.Moniker);

                } else if (picklistMetaData._FullAddress === "true") {
                  searchMethod = verifier.doGetAddress;
                  setPicklistMoniker(picklistMetaData.Moniker);
                }

                afterPicklistSelect.bind(userStateContext)(
                  event, 
                  picklistMetaData, 
                  oldSearchMethod, 
                  oldPicklistMoniker
                );
                return;
              }
            };

          // There are no more picklists -- at final stage of selection process (full address)
          } else {
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

    let resultElement = document.createElement('div');
    resultElement.id = 'typedown-results';

    picklists.forEach((picklist, index) => {
      let element = document.createElement('a');
      element.setAttribute('picklist-metadata', JSON.stringify(picklist));
      element.href = "#";
      element.tabIndex = 0;
      element.innerText = picklist.Picklist;
      element.className = 'pointer shadow-hover picklist-item db link black';
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
        stateMapper(fieldElement.field, rawAddress[fieldElement.elements[0]]);
        return;
      }

      fieldElement.field.value
        = fieldElement.elements.map((addressElement) => {
          return rawAddress[addressElement];
        }).join(fieldElement.separator);
    });

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
})();
