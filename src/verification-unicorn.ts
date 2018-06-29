import autoComplete from '../node_modules/autocompletion/lib/autocompletion.js';
import { generateModal } from './functions/verification-modal';
import { stateMapper } from './functions/state-mapper';

// Polyfills for compatiability
// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
    (Element.prototype as any).remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

(function () {
  window.autoComplete = autoComplete;
})();

(function () {

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
   * @param {String} mode
   * @param {Event} newEvent
   *
   * @returns {Element}
   */
  function openModal(mode, newEvent) {
    if (document.getElementById('edq-overlay-container')) {
      return document.getElementById('edq-overlay-container');
    }

    let modalElement = document.createElement('div');
    modalElement.id = 'edq-overlay-container';
    modalElement.innerHTML = generateModal(mode);
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
    modalElement.querySelector('#interaction--use-original').onclick = function(event) {
      useOriginalAddress(newEvent);
    }

    modalElement.querySelector('#edq-close-modal').onclick = function() {
      modalElement.remove();
      const suggestionBox = document.querySelector('#edq-verification-suggestion-box');
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
    let savedTarget = newEvent['savedTarget'];
    let callback = EDQ_CONFIG.PRO_WEB_CALLBACK;
    if (callback) {
      if (typeof(callback) === "string") {
        eval(callback);
      } else if (typeof(callback) === "function") {
        callback(newEvent.savedTarget, newEvent);
      } else {
        throw "PRO_WEB_CALLBACK must be either text resolving to javascript or a function";
      }

    } else {
      // Reverting the element changes appears to make things a bit easier.
      savedTarget[`on${newEvent.type}`] = newEvent['originalEvent'];
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
        stateMapper(fieldElement.field, rawAddress[fieldElement.elements[0]]);
        return;
      }

      fieldElement.field.value
        = fieldElement.elements.map((addressElement) => {
          return rawAddress[addressElement] == '[object Object]' ? '' : rawAddress[addressElement];
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

        const verifyLevel = data.Envelope.Body.QASearchResult._VerifyLevel;
        let addressLines;
        let modalElement;

        switch(verifyLevel) {

          case 'InteractionRequired':
            addressLines = data.Envelope.Body.QASearchResult.QAAddress.AddressLine;
            modalElement = openModal(verifyLevel, newEvent);

            modalElement.querySelector('#interaction--use-updated').onclick = function() {
              updateValuesFromMapping(EDQ_CONFIG.PRO_WEB_MAPPING, createRawAddressMap(addressLines));
              closeModal();
              finalCallback(newEvent);
            }

            displayOriginalAddress();
            let interactionAddressField: object = {};
            const rawAddress: object = createRawAddressMap(addressLines);
            EDQ_CONFIG.PRO_WEB_MAPPING.forEach((mapping) => {
              interactionAddressField[mapping['modalFieldSelector']] =
                modalElement.querySelector(mapping['modalFieldSelector'].replace('original-', ''));
              interactionAddressField[mapping['modalFieldSelector']].innerText = mapping['elements'].map((element) => {
                return rawAddress[element];
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
            displayOriginalAddress()

            new autoComplete({
              minChars: 0,
              selector: modalElement.querySelector('#interaction-address--select-field'),
              delay: 25,
              cache: false,
              onSelect: function(event, term, item) {
                verifier.doGetAddress({
                  layout: EDQ_CONFIG.PRO_WEB_LAYOUT,
                  moniker: item.getAttribute('data-moniker'),
                  callback: function(address) {
                    updateValuesFromMapping(
                      EDQ_CONFIG.PRO_WEB_MAPPING,
                      createRawAddressMap(address.Envelope.Body.Address.QAAddress.AddressLine)
                    );

                    closeModal();
                    removeModalElements();
                    finalCallback(newEvent);
                  }
                });
              },

              renderItem: function(item, search) {

                /** The HTML shown for each picklist item */
                function picklistHtml(moniker: string, picklist : string, postCode : string, multiples : boolean) : string{
                  return `<div
                          class="${multiples ? 'edq-disabled-address' : 'edq-global-intuitive-address-suggestion'}"
                          data-moniker='${moniker}'>
                            <div class='edq-address-picklist'>${picklist.split(',')[0]}</div>
                            <div class='edq-address-postal-code'>${postCode}</div>
                       </div>`;
                }

                // Needed for backwards compatiability with older browsers
                const picklist = String(item.Picklist);
                const postCode = String(item.Postcode);
                const moniker = String(item.Moniker);

                return picklistHtml(moniker, picklist, postCode, item._UnresolvableRange === "true" || item._Multiples === "true")
              },

              source: function(term, response) {
                let xhr;
                try {
                  xhr.abort();
                } catch(e) {
                }

                xhr = verifier.doRefine({
                  country: EDQ_CONFIG.PRO_WEB_COUNTRY,
                  refineOptions: {},
                  layout: EDQ_CONFIG.PRO_WEB_LAYOUT,
                  moniker: data.Envelope.Body.QASearchResult.QAPicklist.FullPicklistMoniker,
                  refinement: term,
                  formattedAddressInPicklist: false,
                  callback: function(data) {
                    try {
                      const items = data.Envelope.Body.Picklist.QAPicklist.PicklistEntry;

                      if (items.length) {
                        response(items);
                      } else {
                        response([items]);
                      }
                    } catch(e) {
                    }
                  }
                });
              }
            })

            break;

          default:
            openModal(verifyLevel, newEvent);
            displayOriginalAddress();
        }

      }
    });

    try {
      xhr.timeout = EDQ_CONFIG.PRO_WEB_TIMEOUT || 2500;
    } catch(e) {
      // Pass the internet explorer error
    }

  };

  // Make it so each submission element and trigger are reset
  EDQ_CONFIG.PRO_WEB_SUBMIT_TRIGGERS.forEach(function(pair) {
    const eventType = pair.type;
    const triggerElement = pair.element;
    const originalTriggerEvent = triggerElement[`on${eventType}`];

    // For Firefox/Chrome support
    // See: https://stackoverflow.com/questions/95731/why-does-an-onclick-property-set-with-setattribute-fail-to-work-in-ie
    triggerElement.setAttribute(`on${eventType}`, `function(event) {
      var newEvent = createNewEvent(event);
      newEvent['savedTarget'] = triggerElement.cloneNode();
      newEvent['originalEvent'] = originalTriggerEvent;
      submitForm(newEvent);
    }`);

    triggerElement[`on${eventType}`] = function(event) {
      let newEvent = createNewEvent(event);
      newEvent['savedTarget'] = triggerElement.cloneNode();
      newEvent['originalEvent'] = originalTriggerEvent;
      submitForm(newEvent);
    }
  });

}).call(this);
