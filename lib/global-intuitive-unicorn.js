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
(function () {
    window.autoComplete = autocompletion_js_1.default;
})();
/**
 * @module EDQ
 */
(function () {
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
    var EDQ_CONFIG = function () {
        return window.EdqConfig || {};
    };
    var globalIntuitiveElement = EDQ_CONFIG().GLOBAL_INTUITIVE_ELEMENT;
    var mapping = EDQ_CONFIG().GLOBAL_INTUITIVE_MAPPING;
    var debug = EDQ_CONFIG().DEBUG;
    if (EDQ_CONFIG().GLOBAL_INTUITIVE_PLACEHOLDER) {
        document.getElementById(globalIntuitiveElement).setAttribute('placeholder', EDQ_CONFIG().GLOBAL_INTUITIVE_PLACEHOLDER);
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
    var mapElementsToField = function (_a) {
        var elements = _a.elements, field = _a.field, _b = _a.separator, separator = _b === void 0 ? ' ' : _b, data = _a.data;
        try {
            var fieldValue = elements.map(function (elementValue) {
                return eval("data." + elementValue);
            });
            /* Regex to find the last instance of the separator, if present */
            var regex = new RegExp(separator + '$');
            /* Remove the separator if there are no matches */
            var newValue = fieldValue.join(separator).replace(regex, '');
            field.value = newValue;
        }
        catch (e) {
        }
    };
    var xhr;
    var EDQ;
    if (window.EDQ) {
        EDQ = window.EDQ;
    }
    else {
        throw 'Please make sure that EDQ Pegasus is included in your HTML before EDQ Unicorn.';
    }
    var onSelect = (function (event, term, item) {
        event.preventDefault();
        EDQ.address.globalIntuitive.format({
            formatUrl: term,
            callback: function (data, error) {
                if (debug) {
                    console.log(Date() + " " + JSON.stringify(error || data));
                }
                /* Put the label keys on the top level component */
                data.address.forEach(function (a) {
                    var k = Object.keys(a)[0];
                    var o = {};
                    data.address[k] = a[k];
                });
                data.components.forEach(function (a) {
                    var k = Object.keys(a)[0];
                    var o = {};
                    data.components[k] = a[k];
                });
                mapping.forEach(function (mapper) {
                    mapElementsToField({
                        elements: mapper.elements,
                        field: mapper.field,
                        separator: mapper.separator,
                        data: data
                    });
                });
            }
        });
    });
    function renderItem(item, search) {
        var matched = item.matched;
        var suggestion = item.suggestion;
        matched.forEach(function (match) {
            var matchedItem = "<strong>" + suggestion.substring(match[0], match[1]) + "</strong>";
            suggestion = "" + suggestion.substring(0, match[0]) + matchedItem + suggestion.substring(match[1]);
        });
        return "<div style=\"hover:cursor\" data-suggestion='" + item.suggestion + "' data-format='" + item.format + "' class=\"edq-global-intuitive-address-suggestion\">" + suggestion + "</div>";
    }
    ;
    var source = (function (term, response) {
        try {
            xhr.abort();
        }
        catch (e) { }
        xhr = EDQ.address.globalIntuitive.search({
            query: term,
            country: EDQ_CONFIG().GLOBAL_INTUITIVE_ISO3_COUNTRY || 'USA',
            take: EDQ_CONFIG().GLOBAL_INTUITIVE_TAKE || 7,
            callback: function (data, error) {
                try {
                    response(data.results);
                }
                catch (e) {
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
    EDQ.address.globalIntuitive.activateValidation = (function (element) {
        new autocompletion_js_1.default({
            selector: element,
            delay: 0,
            onSelect: onSelect,
            renderItem: renderItem,
            source: source
        });
    });
    EDQ.address.globalIntuitive.activateValidation(globalIntuitiveElement);
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


/***/ })
/******/ ]);