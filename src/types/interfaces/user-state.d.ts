/* UserState represents the state of both the UI at the time and the "back-end", which 
 * consists of things like the function used for search and the parameters */
interface UserStateInterface {
  'prompt text': string,
  'input value': string,
  'suggestions': string,
  'previous suggestions': string,
  'search method': Function,
  'event': Event,
  'moniker': string,
  'metadata': PicklistObject
}
