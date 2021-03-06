interface UnicornObject {
  DEBUG?: boolean,

  PHONE_ELEMENTS?: Array<Element>,
  EMAIL_ELEMENTS?: Array<Element>,

  LOADING_BASE64_ICON?: string,
  VERIFIED_BASE64_ICON?: string,
  INVALID_BASE64_ICON?: string,
  UNKNOWN_BASE64_ICON?: string,


  PRO_WEB_MAPPING: Array<any>,
  PRO_WEB_COUNTRY: string,
  PRO_WEB_CALLBACK: any,
  PRO_WEB_LAYOUT: string,
  PRO_WEB_SUBMIT_TRIGGERS: Array<TriggerPair>,
  PRO_WEB_TIMEOUT: string,
  PRO_WEB_SERVICE_URL: string,
  // To be used only if you're calling submitForm manually.  
  NO_SAVED_TARGET: boolean,
  SOAP_ACTION_URL: string,

  PRO_WEB_TYPEDOWN_TRIGGER: Element
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
