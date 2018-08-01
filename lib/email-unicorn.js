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
/***/ (function(module, exports) {

(function () {
    /* Configuration */
    var _this = this;
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
    var EDQ_CONFIG = window.EdqConfig || {};
    var EMAIL_ELEMENTS = EDQ_CONFIG.EMAIL_ELEMENTS;
    if (!EMAIL_ELEMENTS || EMAIL_ELEMENTS.length === 0) {
        throw 'EMAIL_ELEMENTS not specified in EdqConfig';
    }
    var LOADING_BASE64_ICON = EDQ_CONFIG.LOADING_BASE64_ICON || 'data:image/gif;base64,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';
    if (!LOADING_BASE64_ICON) {
        throw 'LOADING_BASE64_ICON not specified, or blank. Please check EdqConfig';
    }
    var VERIFIED_BASE64_ICON = EDQ_CONFIG.VERIFIED_BASE64_ICON || 'data:image/png;base64,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';
    if (!VERIFIED_BASE64_ICON) {
        throw 'VERIFIED_BASE64_ICON not specified, or blank. Please check EdqConfig';
    }
    var INVALID_BASE64_ICON = EDQ_CONFIG.INVALID_BASE64_ICON || 'data:image/png;base64,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';
    if (!INVALID_BASE64_ICON) {
        throw 'INVALID_BASE64_ICON not specified, or blank. Please check EdqConfig';
    }
    var UNKNOWN_BASE64_ICON = EDQ_CONFIG.UNKNOWN_BASE64_ICON || 'data:image/png;base64,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';
    if (!UNKNOWN_BASE64_ICON) {
        throw 'UNKNOWN_BASE64_ICON not specified, or blank. Please check EdqConfig';
    }
    /**
     * @param {Element} element
     * @param {String} base64DataUri
     *
     * @returns {undefined}
     */
    var changeIcon = (function (element, base64DataUri) {
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
    var addSuggestion = (function (data, emailElement) {
        if (data.Corrections && data.Corrections.length > 0) {
            var element = void 0;
            if (document.getElementById('edq-email-suggestion')) {
                element = document.getElementById('edq-email-suggestion');
                element.textContent = "Did you mean: " + data.Corrections[0] + "?";
                ;
            }
            else {
                element = document.createElement('div');
                element.id = 'edq-email-suggestion';
                element.style.fontSize = '0.5rem';
                element.style.cursor = 'pointer';
                element.textContent = "Did you mean: " + data.Corrections[0] + "?";
                ;
                element.addEventListener('click', (function (event) {
                    var email = event.target.textContent.match(/: (.*)(\?)/)[1];
                    emailElement.value = email;
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
    var removeSuggestion = (function () {
        try {
            document.getElementById('edq-email-suggestion').remove();
        }
        catch (e) {
        }
    });
    /**
     * @param {String} correction
     *
     * @returns {Element}
     */
    var addCorrection = (function (correction) {
        var element = document.createElement('a');
        element.href = '';
        element.textContent = "Did you mean " + correction + "?";
        var style = element.style;
        style.fontSize = '0.5rem';
        return element;
    });
    var EDQ;
    if (window.EDQ) {
        EDQ = window.EDQ;
    }
    else {
        throw 'Please make sure that EDQ Pegasus is included in your HTML before EDQ Unicorn.';
    }
    /**
     * @param {Array<Element>} element
     *
     * @returns {undefined}
     */
    var activateEmailValidation = (function (elements) {
        var _loop_1 = function (i) {
            var element = elements[i];
            var emailElement = element;
            var oldOnChangeFn = element.onchange;
            if (oldOnChangeFn) {
                oldOnChangeFn = oldOnChangeFn.bind(_this);
            }
            emailElement.onchange = (function (event) {
                emailElement.removeAttribute('edq-metadata');
                var elementValue = event.target.value;
                if (!elementValue) {
                    removeSuggestion();
                    changeIcon(emailElement, '');
                    return;
                }
                changeIcon(emailElement, LOADING_BASE64_ICON);
                var xhr = EDQ.email.emailValidate({
                    emailAddress: elementValue,
                    callback: function (data, error) {
                        if (EDQ_CONFIG.DEBUG) {
                            console.log('Data:');
                            console.log(data);
                            console.log('Error:');
                            console.log(error);
                        }
                        emailElement.setAttribute('edq-metadata', JSON.stringify(data));
                        if (data && data.Certainty === 'verified') {
                            removeSuggestion();
                            changeIcon(emailElement, VERIFIED_BASE64_ICON);
                        }
                        else if (data && data.Certainty !== 'verified') {
                            removeSuggestion();
                            changeIcon(emailElement, INVALID_BASE64_ICON);
                            if (data.Corrections && data.Corrections.length > 0) {
                                addSuggestion(data, emailElement);
                            }
                        }
                        else if (error) {
                            removeSuggestion();
                            // Remove the stored attributes
                            changeIcon(emailElement, '');
                        }
                        try {
                            oldOnChangeFn(event);
                        }
                        catch (e) {
                        }
                    }
                });
                xhr.timeout = EDQ_CONFIG.EMAIL_TIMEOUT || 10000;
            });
        };
        for (var i = 0; i < elements.length; i++) {
            _loop_1(i);
        }
        ;
    });
    activateEmailValidation(EMAIL_ELEMENTS);
    /**
     * @module EDQ.email
     */
    /**
     * Activates email validation functionality
     *
     * @example @id=activate-email-validation
     *
     * @name activateEmailValidation
     * @function
     *
     * @param {Element} element
     *
     * @returns {undefined}
     */
    EDQ.email.activateEmailValidation = activateEmailValidation;
}).call(this);


/***/ })
/******/ ]);