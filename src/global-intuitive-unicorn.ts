/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

var autoComplete = (function(){
    // "use strict";
    function autoComplete(options){
        if (!document.querySelector) return;

        // helpers
        function hasClass(el, className){ return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className); }

        function addEvent(el, type, handler){
            if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
        }
        function removeEvent(el, type, handler){
            // if (el.removeEventListener) not working in IE11
            if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
        }
        function live(elClass, event, cb, context){
            addEvent(context || document, event, function(e){
                var found, el = e.target || e.srcElement;
                while (el && !(found = hasClass(el, elClass))) el = el.parentElement;
                if (found) cb.call(el, e);
            });
        }

        var o = {
            selector: '',
            source: function(v,s) {},
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: function (item, search){
                // escape special characters
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="edq-global-intuitive-address-suggestion" data-format="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
            },
            onSelect: function(e, term, item){}
        };

        for (var k in options) { if (options.hasOwnProperty(k)) o[k] = options[k]; }

        // init
        var elems = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (var i=0; i<elems.length; i++) {
            var that = elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = 'edq-global-intuitive-address-suggestions '+o.menuClass;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.lastVal = '';

            that.updateSC = function(resize, next){
                var rect = that.getBoundingClientRect();
                that.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
                that.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
                that.sc.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) { that.sc.maxHeight = parseInt(String((window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle).maxHeight)); }
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = that.sc.querySelector('.edq-global-intuitive-address-suggestion').offsetHeight;
                    if (that.sc.suggestionHeight)
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            var scrTop = that.sc.scrollTop, selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            else if (selTop < 0)
                                that.sc.scrollTop = selTop + scrTop;
                        }
                }
            }
            addEvent(window, 'resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('edq-global-intuitive-address-suggestion', 'mouseleave', function(e){
                var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                if (sel) setTimeout(function(){ sel.className = sel.className.replace('selected', ''); }, 20);
            }, that.sc);

            live('edq-global-intuitive-address-suggestion', 'mouseover', function(e){
                var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                if (sel) sel.className = sel.className.replace('selected', '');
                this.className += ' selected';
            }, that.sc);

            live('edq-global-intuitive-address-suggestion', 'mousedown', function(e){
                if (hasClass(this, 'edq-global-intuitive-address-suggestion')) { // else outside click
                    var v = this.getAttribute('data-format');
                    o.onSelect(e, v, this);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = function(){
              var over_sb;
                try { over_sb = document.querySelector('.edq-global-intuitive-address-suggestions:hover'); } catch(e){ over_sb = 0; }
                if (!over_sb) {
                    that.lastVal = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(function(){ that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(function(){ that.focus(); }, 20);
            };
            addEvent(that, 'blur', that.blurHandler);

            var suggest = function(data){
                var val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i=0;i<data.length;i++) s += o.renderItem(data[i], val);
                    that.sc.innerHTML = s;
                    that.updateSC(0);
                }
                else
                    that.sc.style.display = 'none';
            }

            that.keydownHandler = function(e){
                var key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key == 40 || key == 38) && that.sc.innerHTML) {
                    var next, sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                    if (!sel) {
                        next = (key == 40) ? that.sc.querySelector('.edq-global-intuitive-address-suggestion') : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-suggestion');
                    } else {
                        next = (key == 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-suggestion');
                        }
                        else { sel.className = sel.className.replace('selected', ''); that.value = that.lastVal; next = 0; }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (key == 27) { that.value = that.lastVal; that.sc.style.display = 'none'; }
                // enter
                else if (key == 13 || key == 9) {
                    var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
                    if (sel && that.sc.style.display != 'none') { o.onSelect(e, sel.getAttribute('data-format'), sel); setTimeout(function(){ that.sc.style.display = 'none'; }, 20); }
                }
            };
            addEvent(that, 'keydown', that.keydownHandler);

            that.keyupHandler = function(e){
                var key = window.event ? e.keyCode : e.which;
                if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
                    var val = that.value;
                    if (val.length >= o.minChars) {
                        if (val != that.lastVal) {
                            that.lastVal = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (var i=1; i<val.length-o.minChars; i++) {
                                    var part = val.slice(0, val.length-i);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(function(){ o.source(val, suggest) }, o.delay);
                        }
                    } else {
                        that.lastVal = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            addEvent(that, 'keyup', that.keyupHandler);

            that.focusHandler = function(e){
                that.lastVal = '\n';
                that.keyupHandler(e)
            };
            if (!o.minChars) addEvent(that, 'focus', that.focusHandler);
        }

        // public destroy method
        this.destroy = function(){
            for (var i=0; i<elems.length; i++) {
                var that = elems[i];
                removeEvent(window, 'resize', that.updateSC);
                removeEvent(that, 'blur', that.blurHandler);
                removeEvent(that, 'focus', that.focusHandler);
                removeEvent(that, 'keydown', that.keydownHandler);
                removeEvent(that, 'keyup', that.keyupHandler);
                if (that.autocompleteAttr)
                    that.setAttribute('autocomplete', that.autocompleteAttr);
                else
                    that.removeAttribute('autocomplete');
                document.body.removeChild(that.sc);
                that = null;
            }
        };
    }
    return autoComplete;
})();

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
  let EDQ_CONFIG = <UnicornObject> window.EdqConfig || <UnicornObject> {};

  let globalIntuitiveElement = EDQ_CONFIG.GLOBAL_INTUITIVE_ELEMENT;
  let mapping = EDQ_CONFIG.GLOBAL_INTUITIVE_MAPPING;
  let debug = EDQ_CONFIG.DEBUG;

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

  const renderItem = ((item, search) => {
    let matched = item.matched;
    let suggestion = item.suggestion;

    matched.forEach((match) => {
      let matchedItem = `<strong>${suggestion.substring(match[0], match[1])}</strong>`;
      suggestion = `${suggestion.substring(0, match[0])}${matchedItem}${suggestion.substring(match[1])}`;
    });

    return `<div style="hover:cursor" data-suggestion='${item.suggestion}' data-format='${item.format}' class="edq-global-intuitive-address-suggestion">${suggestion}</div>`;
  });

  const source = ((term, response) => {
    try {
      xhr.abort();
    } catch(e) {}

    xhr = EDQ.address.globalIntuitive.search({
      query: term,
      country: EDQ_CONFIG.GLOBAL_INTUITIVE_ISO3_COUNTRY || 'USA',
      take: EDQ_CONFIG.GLOBAL_INTUITIVE_TAKE || 7,
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
