/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
    */
export default (function () {
  // "use strict";
  function autoComplete(options) {
    if (!document.querySelector)
      return;
    // helpers
    function hasClass(el, className) { return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className); }
    function addEvent(el, type, handler) {
      if (el.attachEvent)
        el.attachEvent('on' + type, handler);
      else
        el.addEventListener(type, handler);
    }
    function removeEvent(el, type, handler) {
      // if (el.removeEventListener) not working in IE11
      if (el.detachEvent)
        el.detachEvent('on' + type, handler);
      else
        el.removeEventListener(type, handler);
    }
    function live(elClass, event, cb, context) {
      addEvent(context || document, event, function (e) {
        var found, el = e.target || e.srcElement;
        while (el && !(found = hasClass(el, elClass)))
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
        // escape special characters
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
    // init
    var elems = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
    for (var i = 0; i < elems.length; i++) {
      var that = elems[i];
      // create suggestions container "sc"
      that.sc = document.createElement('div');
      that.sc.id = 'edq-verification-suggestion-box';
      that.sc.className = 'edq-global-intuitive-address-suggestions ' + o.menuClass;
      that.autocompleteAttr = that.getAttribute('autocomplete');
      that.setAttribute('autocomplete', 'off');
      that.cache = {};
      that.lastVal = '';
      that.updateSC = function (resize, next) {
        var rect = that.getBoundingClientRect();
        that.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
        that.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
        that.sc.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
        if (!resize) {
          that.sc.style.display = 'block';
          if (!that.sc.maxHeight) {
            that.sc.maxHeight = parseInt(String((window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle).maxHeight));
          }
          if (!that.sc.suggestionHeight)
            that.sc.suggestionHeight = that.sc.querySelector('.edq-global-intuitive-address-suggestion').offsetHeight;
          if (that.sc.suggestionHeight)
            if (!next)
              that.sc.scrollTop = 0;
          else {
            var scrTop = that.sc.scrollTop, selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
              that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
            else if (selTop < 0)
              that.sc.scrollTop = selTop + scrTop;
          }
        }
      };
      addEvent(window, 'resize', that.updateSC);
      document.body.appendChild(that.sc);
      live('edq-global-intuitive-address-suggestion', 'mouseleave', function (e) {
        var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
        if (sel)
          setTimeout(function () { sel.className = sel.className.replace('selected', ''); }, 20);
      }, that.sc);
      live('edq-global-intuitive-address-suggestion', 'mouseover', function (e) {
        var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
        if (sel)
          sel.className = sel.className.replace('selected', '');
        this.className += ' selected';
      }, that.sc);
      live('edq-global-intuitive-address-suggestion', 'mousedown', function (e) {
        if (hasClass(this, 'edq-global-intuitive-address-suggestion')) {
          var v = this.getAttribute('data-format');
          o.onSelect(e, v, this);
          that.sc.style.display = 'none';
        }
      }, that.sc);
      that.blurHandler = function () {
        var over_sb;
        try {
          over_sb = document.querySelector('.edq-global-intuitive-address-suggestions:hover');
        }
        catch (e) {
          over_sb = 0;
        }
        if (!over_sb) {
          that.lastVal = that.value;
          that.sc.style.display = 'none';
          setTimeout(function () { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
        }
        else if (that !== document.activeElement)
          setTimeout(function () { that.focus(); }, 20);
      };
      addEvent(that, 'blur', that.blurHandler);
      var suggest = function (data) {
        var val = that.value;
        that.cache[val] = data;
        if (data.length && val.length >= o.minChars) {
          var s = '';
          for (var i = 0; i < data.length; i++)
            s += o.renderItem(data[i], val);
          that.sc.innerHTML = s;
          that.updateSC(0);
        }
        else
          that.sc.style.display = 'none';
      };
      that.keydownHandler = function (e) {
        var key = window.event ? e.keyCode : e.which;
        // down (40), up (38)
        if ((key == 40 || key == 38) && that.sc.innerHTML) {
          var next, sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
          if (!sel) {
            next = (key == 40) ? that.sc.querySelector('.edq-global-intuitive-address-suggestion') : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
            next.className += ' selected';
            that.value = next.getAttribute('data-suggestion');
          }
          else {
            next = (key == 40) ? sel.nextSibling : sel.previousSibling;
            if (next) {
              sel.className = sel.className.replace('selected', '');
              next.className += ' selected';
              that.value = next.getAttribute('data-suggestion');
            }
            else {
              sel.className = sel.className.replace('selected', '');
              that.value = that.lastVal;
              next = 0;
            }
          }
          that.updateSC(0, next);
          return false;
        }
        else if (key == 27) {
          that.value = that.lastVal;
          that.sc.style.display = 'none';
        }
        else if (key == 13 || key == 9) {
          var sel = that.sc.querySelector('.edq-global-intuitive-address-suggestion.selected');
          if (sel && that.sc.style.display != 'none') {
            o.onSelect(e, sel.getAttribute('data-format'), sel);
            setTimeout(function () { that.sc.style.display = 'none'; }, 20);
          }
        }
      };
      addEvent(that, 'keydown', that.keydownHandler);
      that.keyupHandler = function (e) {
        var key = window.event ? e.keyCode : e.which;
        if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
          var val = that.value;
          if (val.length >= o.minChars) {
            if (val != that.lastVal) {
              that.lastVal = val;
              clearTimeout(that.timer);
              if (o.cache) {
                if (val in that.cache) {
                  suggest(that.cache[val]);
                  return;
                }
                // no requests if previous suggestions were empty
                for (var i = 1; i < val.length - o.minChars; i++) {
                  var part = val.slice(0, val.length - i);
                  if (part in that.cache && !that.cache[part].length) {
                    suggest([]);
                    return;
                  }
                }
              }
              that.timer = setTimeout(function () { o.source(val, suggest); }, o.delay);
            }
          }
          else {
            that.lastVal = val;
            that.sc.style.display = 'none';
          }
        }
      };
      addEvent(that, 'keyup', that.keyupHandler);
      that.focusHandler = function (e) {
        that.lastVal = '\n';
        that.keyupHandler(e);
      };
      if (!o.minChars)
        addEvent(that, 'focus', that.focusHandler);
    }
    // public destroy method
    this.destroy = function () {
      for (var i = 0; i < elems.length; i++) {
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


