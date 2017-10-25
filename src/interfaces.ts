interface Window {
  autoComplete?: object,
  EdqConfig?: UnicornObject,
  EDQ?: PegasusObject
}

interface Object {
  maxHeight?: number,
  elements?: Array<Object>,
  field?: string,
  separator?: string,
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

  PHONE_ELEMENTS?: Array<Element>,
  EMAIL_ELEMENTS?: Array<Element>,

  LOADING_BASE64_ICON?: string,
  VERIFIED_BASE64_ICON?: string,
  INVALID_BASE64_ICON?: string,
  UNKNOWN_BASE64_ICON?: string,

  GLOBAL_INTUITIVE_ELEMENT?: string,
  GLOBAL_INTUITIVE_PLACEHOLDER?: string,
  GLOBAL_INTUITIVE_MAPPING?: Array<Object>,
  GLOBAL_INTUITIVE_TAKE?: number,
  GLOBAL_INTUITIVE_ISO3_COUNTRY: 'USA',

  EMAIL_TIMEOUT: number,
  PHONE_TIMEOUT: number,

  USE_REVERSE_PHONE_APPEND: boolean,
  REVERSE_PHONE_APPEND_MAPPINGS: Array<ReversePhoneAppendMapping>
}

interface ReversePhoneAppendMapping {
  element: Element,
  fields: Array<string>,
  separator: string
}

interface RPAObject {
  "Number"?: string,
  AccountType?: string,
  PhoneType?: string,
  Name?: string,
  FirstName?: string,
  MiddleInitial?: string,
  LastName?: string,
  Address?: {
     Country?: string,
     Locality1?: string,
     Number1?: string,
     Postcode1?: string,
     Province1?: string,
     Street1?: string,
     Certainty?: string,
  },
  Country?: string,
  Certainty?: string,
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
  blurHandler: object,
  keydownHandler: object,
  focus: () => void,
  timer?: any,
  source?: () => any
}

