import autoComplete from '../node_modules/autocompletion/lib/autocompletion.js';

(function(){
  window.autoComplete = autoComplete;
})();

/**
 * @module EDQ
 */

(function() {
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
  let EDQ_CONFIG = function() {
    return <UnicornObject> window.EdqConfig || <UnicornObject> {};
  }

  let globalIntuitiveElement = EDQ_CONFIG().GLOBAL_INTUITIVE_ELEMENT;
  let mapping = EDQ_CONFIG().GLOBAL_INTUITIVE_MAPPING;
  let debug = EDQ_CONFIG().DEBUG;

  if (EDQ_CONFIG().GLOBAL_INTUITIVE_PLACEHOLDER) {
    document.getElementById(globalIntuitiveElement).setAttribute('placeholder',
      EDQ_CONFIG().GLOBAL_INTUITIVE_PLACEHOLDER);
  }

  if (debug) {
    console.log('Global Intuitive Unicorn started');
  }

  /** Map the specified elements back to the specified fields
   *
   * @param {Array} elements
   * @param {Element} field
   * @param {Object} data
   *
   * @returns {undefined}
   */
  let mapElementsToField = function({elements, field, separator = ' ', data}) {
    try {
      const fieldValue = elements.map((elementValue) => {
        return eval(`data.${elementValue}`);
      });

      /* Regex to find the last instance of the separator, if present */
      let regex = new RegExp(separator + '$');

      /* Remove the separator if there are no matches */
      const newValue = fieldValue.join(separator).replace(regex, '');
      field.value = newValue;
    } catch(e) {
    }
  };

  let xhr;
  let EDQ;
  if (window.EDQ) {
    EDQ = window.EDQ;
  } else {
    throw 'Please make sure that EDQ Pegasus is included in your HTML before EDQ Unicorn.';
  }

  const onSelect = ((event, term, item ) => {
    event.preventDefault();

    EDQ.address.globalIntuitive.format({
      formatUrl: term,
      callback: function(data, error) {
        if (debug) {
          console.log(`${Date()} ${JSON.stringify(error||data)}`)
        }

        /* Put the label keys on the top level component */
        data.address.forEach((a) => {
          const k = Object.keys(a)[0];
          let o = {};
          data.address[k] = a[k];
        });

        data.components.forEach((a) => {
          const k = Object.keys(a)[0];
          let o = {};
          data.components[k] = a[k];
        });

        mapping.forEach((mapper) => {
          mapElementsToField({
            elements: mapper.elements,
            field: mapper.field,
            separator: mapper.separator,
            data
          });
        });
      }
    });
  });

  function renderItem(item : any, search) {
    let matched = item.matched;
    let suggestion = item.suggestion;

    matched.forEach((match) => {
      let matchedItem = `<strong>${suggestion.substring(match[0], match[1])}</strong>`;
      suggestion = `${suggestion.substring(0, match[0])}${matchedItem}${suggestion.substring(match[1])}`;
    });

    return `<div style="hover:cursor" data-suggestion='${item.suggestion}' data-format='${item.format}' class="edq-global-intuitive-address-suggestion">${suggestion}</div>`;
  };

  const source = ((term, response) => {
    try {
      xhr.abort();
    } catch(e) {}

    xhr = EDQ.address.globalIntuitive.search({
      query: term,
      country: EDQ_CONFIG().GLOBAL_INTUITIVE_ISO3_COUNTRY || 'USA',
      take: EDQ_CONFIG().GLOBAL_INTUITIVE_TAKE || 7,
      callback: function(data, error) {
        try {
          response(data.results);
        } catch(e) {
        }
      }
    });
  });


  /**
   * @module EDQ.address
   */

  /**
   * Activates global intuitive search
   *
   * @example @id=activate-global-intuitive-validation
   *
   * @name activateValidation
   * @function
   *
   * @param {Element} element
   *
   * @returns {undefined}
   */
  EDQ.address.globalIntuitive.activateValidation = ((element) => {
    new autoComplete({
      selector: element,
      delay: 0,
      onSelect,
      renderItem,
      source
    })
  });

  EDQ.address.globalIntuitive.activateValidation(globalIntuitiveElement);

}).call(this);
