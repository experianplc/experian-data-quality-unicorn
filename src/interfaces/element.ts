interface Element {
  sc: Element,

  autocompleteAttr: string,
  lastVal: string,
  style: { left: string,
    width: string,
    top: string,
    display: string,
  },

  currentStyle: object,
  maxHeight: number,
  suggestionHeight: number,
  offsetHeight: number,
  value: any,
  cache: object,

  updateSC: (reize: any, next?: any) => void,
  focusHandler: (event) => void,
  keyupHandler: (event) => void,
  blurHandler: object,
  keydownHandler: object,
  focus: () => void,
  timer?: any,
  source?: () => any
}
