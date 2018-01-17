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
  SOAP_ACTION_URL: string,

  PRO_WEB_TYPEDOWN_TRIGGER: Element
}
