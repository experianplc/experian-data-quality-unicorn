/*
    JavaScript AutoComplete v1.0
    Copyright (c) 2018 Experian
    GitHub: https://github.com/experianplc/AutoComplete
 */

// TODO: Move to a separate file
interface SuggestionsContainer extends HTMLDivElement {
  suggestionHeight: number;
  currentStyle: CSSStyleDeclaration;
  querySelector: (query: string) => HTMLElement
}

class AutoCompleteElement extends Element {
  suggestionsContainer: SuggestionsContainer;

  autocompleteAttr: string;
  lastVal: string;
  style: { left: string;
    width: string;
    top: string;
    display: string;
  };

  currentStyle: object;
  maxHeight: number;
  suggestionHeight: number;
  offsetHeight: number;
  value: any;
  cache: object;

  updateSC: (reize: any, next?: any) => void;
  focusHandler: (event) => void;
  keyupHandler: (event) => void;
  onclick: (event) => void;
  blurHandler: object;
  keydownHandler: object;
  focus: () => void;
  timer?: any;
  source?: () => any
}

interface AutoCompleteOptions extends Object {
  selector?: string | HTMLElement;
  source?: (term : string, response: any) => void;
  minChars?: number;
  delay?: number;
  offsetLeft?: number;
  offsetTop?: number;
  cache?: boolean;
  menuClass?: string;
  renderItem?: (item: any, searchTerm: string) => string;
  onSelect?: (e, term, item) => void;
}

export default (function () {
  function autoComplete(options : AutoCompleteOptions): void {
    if (!document.querySelector)
      return;

    // helpers
    function hasClass(el, className) {
      return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className); 
    }

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
        let found, el = e.target || e.srcElement;
        while (el && !(found = hasClass(el, elClass)))
          el = el.parentElement;
        if (found)
          cb.call(el, e);
      });
    }

    let o = {
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
        let re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
        return '<div class="edq-global-intuitive-address-suggestion" data-format="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
      },
      onSelect: function (e, term, item) { }
    };

    for (let k in options) {
      if (options.hasOwnProperty(k))
        o[k] = options[k];
    }

    // init
    let elems = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
    for (let i = 0; i < elems.length; i++) {
      let that = elems[i] as AutoCompleteElement;
      
      that.suggestionsContainer = document.createElement('div') as SuggestionsContainer;
      that.suggestionsContainer.id = 'edq-verification-suggestion-box';
      that.suggestionsContainer.className = 'edq-global-intuitive-address-suggestions ' + o.menuClass;

      that.autocompleteAttr = that.getAttribute('autocomplete');
      that.setAttribute('autocomplete', 'off');
      that.cache = {};
      that.lastVal = '';
      that.updateSC = function (resize, next) {
        let rect = that.getBoundingClientRect();
        that.suggestionsContainer.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
        that.suggestionsContainer.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
        that.suggestionsContainer.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
        if (!resize) {
          that.suggestionsContainer.style.display = 'block';
          if (!that.suggestionsContainer.maxHeight) {
            that.suggestionsContainer.maxHeight = parseInt(String((window.getComputedStyle ? getComputedStyle(that.suggestionsContainer, null) : that.suggestionsContainer.currentStyle).maxHeight));
          }
          if (!that.suggestionsContainer.suggestionHeight)
            that.suggestionsContainer.suggestionHeight = that.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion').offsetHeight;
          if (that.suggestionsContainer.suggestionHeight)
            if (!next)
              that.suggestionsContainer.scrollTop = 0;
          else {
            let scrTop = that.suggestionsContainer.scrollTop, selTop = next.getBoundingClientRect().top - that.suggestionsContainer.getBoundingClientRect().top;
            if (selTop + that.suggestionsContainer.suggestionHeight - that.suggestionsContainer.maxHeight > 0)
              that.suggestionsContainer.scrollTop = selTop + that.suggestionsContainer.suggestionHeight + scrTop - that.suggestionsContainer.maxHeight;
            else if (selTop < 0)
              that.suggestionsContainer.scrollTop = selTop + scrTop;
          }
        }
      };
      addEvent(window, 'resize', that.updateSC);
      document.body.appendChild(that.suggestionsContainer);
      live('edq-global-intuitive-address-suggestion', 'mouseleave', function (e) {
        let sel = that.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
        if (sel)
          setTimeout(function () { sel.className = sel.className.replace('selected', ''); }, 20);
      }, that.suggestionsContainer);
      live('edq-global-intuitive-address-suggestion', 'mouseover', function (e) {
        let sel = that.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
        if (sel)
          sel.className = sel.className.replace('selected', '');
        this.className += ' selected';
      }, that.suggestionsContainer);
      live('edq-global-intuitive-address-suggestion', 'mousedown', function (e) {
        if (hasClass(this, 'edq-global-intuitive-address-suggestion')) {
          let v = this.getAttribute('data-format');
          o.onSelect(e, v, this);
          that.suggestionsContainer.style.display = 'none';
        }
      }, that.suggestionsContainer);
      that.blurHandler = function () {
        let over_sb;
        try {
          over_sb = document.querySelector('.edq-global-intuitive-address-suggestions:hover');
        }
        catch (e) {
          over_sb = 0;
        }
        if (!over_sb) {
          that.lastVal = that.value;
          that.suggestionsContainer.style.display = 'none';
          setTimeout(function () { that.suggestionsContainer.style.display = 'none'; }, 350); // hide suggestions on fast input
        }
        else if (that !== document.activeElement)
          setTimeout(function () { that.focus(); }, 20);
      };

      addEvent(that, 'blur', that.blurHandler);

      let suggest = function (data) {
        let val = that.value;
        that.cache[val] = data;
        if (data.length && val.length >= o.minChars) {
          let s = '';
          for (let i = 0; i < data.length; i++)
            s += o.renderItem(data[i], val);
          that.suggestionsContainer.innerHTML = s;
          that.updateSC(0);
        }
        else
          that.suggestionsContainer.style.display = 'none';
      };

      that.keydownHandler = function (e) {
        let key = window.event ? e.keyCode : e.which;
        // down (40), up (38)
        if ((key == 40 || key == 38) && that.suggestionsContainer.innerHTML) {
          let next, sel = that.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
          if (!sel) {
            next = (key == 40) ? that.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion') : that.suggestionsContainer.childNodes[that.suggestionsContainer.childNodes.length - 1]; // first : last
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
          that.suggestionsContainer.style.display = 'none';
        }
        else if (key == 13 || key == 9) {
          let sel = that.suggestionsContainer.querySelector('.edq-global-intuitive-address-suggestion.selected');
          if (sel && that.suggestionsContainer.style.display != 'none') {
            o.onSelect(e, sel.getAttribute('data-format'), sel);
            setTimeout(function () { that.suggestionsContainer.style.display = 'none'; }, 20);
          }
        }
      };

      addEvent(that, 'keydown', that.keydownHandler);

      that.keyupHandler = function (e) {
        let key = window.event ? e.keyCode : e.which;
        if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
          let val = that.value;
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
                for (let i = 1; i < val.length - o.minChars; i++) {
                  let part = val.slice(0, val.length - i);
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
            that.suggestionsContainer.style.display = 'none';
          }
        }
      };

      addEvent(that, 'keyup', that.keyupHandler);

      that.focusHandler = function(e: Event): void {
        that.lastVal = '\n';
        that.keyupHandler(e);
      };

      if (!o.minChars)
        addEvent(that, 'focus', that.focusHandler);
    }
    // public destroy method
    this.destroy = function () {
      for (let i = 0; i < elems.length; i++) {
        let that = elems[i] as AutoCompleteElement;
        removeEvent(window, 'resize', that.updateSC);
        removeEvent(that, 'blur', that.blurHandler);
        removeEvent(that, 'focus', that.focusHandler);
        removeEvent(that, 'keydown', that.keydownHandler);
        removeEvent(that, 'keyup', that.keyupHandler);
        if (that.autocompleteAttr)
          that.setAttribute('autocomplete', that.autocompleteAttr);
        else
          that.removeAttribute('autocomplete');
        document.body.removeChild(that.suggestionsContainer);
        that = null;
      }
    };
  }
  return autoComplete;
})();
