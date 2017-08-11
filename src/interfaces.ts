interface Window {
  autoComplete?: object,
  EdqConfig?: UnicornObject,
  EDQ?: PegasusObject,
  html: string
}

interface Object {
  maxHeight?: number,
  elements?: Array<Object>,
  field?: string,
  separator?: string,
}

interface Node {
  onclick?: any
}

interface PegasusObject {
  DEBUG?: boolean,

  phone: {
    globalPhoneValidate: ({phoneNumber: string, callback: object}) => XMLHttpRequest,
  },

  address: {
    globalIntuitive: {
      activateValidation: (element) => void,
      search: ({query, country: string, take: number, callback: object}) => XMLHttpRequest,
      format: ({formatUrl: string, callback: object}) => XMLHttpRequest
    }
  },

  email: {
    emailValidate: (object: object) => XMLHttpRequest
    activateEmailValidation: (element: Element) => void
  }
}

interface UnicornObject {
  DEBUG?: boolean,

  PHONE_ELEMENTS?: Array<string>,
  EMAIL_ELEMENTS?: Array<string>,

  LOADING_BASE64_ICON?: string,
  VERIFIED_BASE64_ICON?: string,
  INVALID_BASE64_ICON?: string,
  UNKNOWN_BASE64_ICON?: string,

  GLOBAL_INTUITIVE_ELEMENT?: string,
  GLOBAL_INTUITIVE_MAPPING?: Array<Object>,

  PRO_WEB_MAPPING: Array<any>,
  PRO_WEB_COUNTRY: string,
  PRO_WEB_CALLBACK: any,
  PRO_WEB_LAYOUT: string,
  PRO_WEB_SUBMIT_TRIGGERS: Array<TriggerPair>,
  PRO_WEB_TIMEOUT: string,
  PRO_WEB_SERVICE_URL: string,
  SOAP_ACTION_URL: string
}

interface TriggerPair {
  type: string,
  element: Element
}

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
  onclick: (event) => void,
  blurHandler: object,
  keydownHandler: object,
  focus: () => void,
  timer?: any,
  source?: () => any
}
