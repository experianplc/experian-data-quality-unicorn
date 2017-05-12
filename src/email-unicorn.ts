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
  let EDQ_CONFIG = window.EdqConfig || {};

  const EMAIL_ELEMENTS = EDQ_CONFIG.EMAIL_ELEMENTS;

  if (!EMAIL_ELEMENTS || EMAIL_ELEMENTS.length === 0) {
    throw 'EMAIL_ELEMENTS not specified in EdqConfig';
  }

  const LOADING_BASE64_ICON = EDQ_CONFIG.LOADING_BASE64_ICON || 'data:image/gif;base64,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';
  if (!LOADING_BASE64_ICON) {
    throw 'LOADING_BASE64_ICON not specified, or blank. Please check EdqConfig';
  }

  const VERIFIED_BASE64_ICON = EDQ_CONFIG.VERIFIED_BASE64_ICON || 'data:image/png;base64,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';
  if (!VERIFIED_BASE64_ICON) {
    throw 'VERIFIED_BASE64_ICON not specified, or blank. Please check EdqConfig';
  }

  const INVALID_BASE64_ICON = EDQ_CONFIG.INVALID_BASE64_ICON || 'data:image/png;base64,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';
  if (!INVALID_BASE64_ICON) {
    throw 'INVALID_BASE64_ICON not specified, or blank. Please check EdqConfig';
  }

  const UNKNOWN_BASE64_ICON = EDQ_CONFIG.UNKNOWN_BASE64_ICON || '';

  /**
   * @param {Element} element
   * @param {String} base64DataUri
   *
   * @returns {undefined}
   */
  const changeIcon = ((element, base64DataUri) => {
    element.style.backgroundPosition = 'right center';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = '1rem';
    element.style.backgroundImage = 'url' + '(' + base64DataUri + ')';
  });

  /**
   * @param {Array<Object>} data
   * @param {Element} emailElement
   *
   * @returns {undefined}
   */
  const addSuggestion = ((data, emailElement) => {
    if (data.Corrections && data.Corrections.length > 0) {
      let element;

      if (document.getElementById('edq-email-suggestion')) {
        element = document.getElementById('edq-email-suggestion');
        element.textContent = `Did you mean: ${data.Corrections[0]}?`;;
      } else {
        element = document.createElement('div');
        element.id = 'edq-email-suggestion';
        element.style.fontSize = '0.5rem';
        element.style.cursor = 'pointer';
        element.textContent = `Did you mean: ${data.Corrections[0]}?`;;

        element.addEventListener('click', ((event) => {
          emailElement.value = event.target.textContent.match(/\w+@\w+\.\w+/)[0];
          removeSuggestion();
          changeIcon(emailElement, VERIFIED_BASE64_ICON);
        }));

        emailElement.parentElement.appendChild(element);
      }
    }
  });

  /** 
   * @returns {undefined}
   */
  const removeSuggestion = (() => {
    try {
      document.getElementById('edq-email-suggestion').remove();
    } catch(e) {
    }
  });

  /** 
   * @param {String} correction
   *
   * @returns {Element}
   */
  const addCorrection = ((correction) => {
    var element = document.createElement('a');
    element.href = '';
    element.textContent = 'Did you mean ' + correction + '?';
    element.style.fontSize = '0.5rem';
    return element;
  });

  let EDQ;
  if (window.EDQ) {
    EDQ = window.EDQ;
  } else {
    throw 'Please make sure that EDQ Pegasus is included in your HTML before EDQ Unicorn.';
  }

  /**
   * @param {Array<Element>} element
   *
   * @returns {undefined}
   */
  const activateEmailValidation = ((elements) => {
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let emailElement = element;

      emailElement.addEventListener('change', ((event) => {
        var elementValue = event.target.value;
        if (!elementValue) {
          removeSuggestion();
          changeIcon(emailElement, '');
          return;
        }

        changeIcon(emailElement, LOADING_BASE64_ICON);

        EDQ.email.emailValidate({
          emailAddress: elementValue,

          callback(data, error) {
            if (data && data.Certainty === 'verified') {
              removeSuggestion();
              changeIcon(emailElement, VERIFIED_BASE64_ICON);

            } else if (data && data.Certainty !== 'verified') {
              removeSuggestion();
              changeIcon(emailElement, INVALID_BASE64_ICON);

              if (data.Corrections && data.Corrections.length > 0) {
                addSuggestion(data, emailElement);
              }

            } else if (error) {
              removeSuggestion();
              changeIcon(emailElement, INVALID_BASE64_ICON);
            }
          }
        });
      }));

    };
  });

  activateEmailValidation(EMAIL_ELEMENTS);

  /**
   * Activates email validation functionality
   *
   * @param {Element} element
   *
   * @returns {undefined}
   */
  EDQ.email.activateEmailValidation = activateEmailValidation;

}).call(this);
