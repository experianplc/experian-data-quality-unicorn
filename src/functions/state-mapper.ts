/** Build a map pairing each option innerText with the index for quick switching
 *
 * @param {Element} field
 * @param {String} value - a state value returned from ProWeb, e.g. MA
 *
 * @returns {undefined}
*/

export function stateMapper(field, value) {
  let stateIndexMap = {};
  for (let i = 0; i < field.length; i++) {
    stateIndexMap[field.children[i].innerText.toLowerCase()] = field.children[i].index;
  }

  // TODO: Support other places other than the United States
  const us_states_abbr_to_full =  {
    'al': 'alabama',
    'ak': 'alaska',
    'as': 'american samoa',
    'az': 'arizona',
    'ar': 'arkansas',
    'ca': 'california',
    'co': 'colorado',
    'ct': 'connecticut',
    'de': 'delaware',
    'dc': 'district of columbia',
    'fm': 'federated states of micronesia',
    'fl': 'florida',
    'ga': 'georgia',
    'gu': 'guam',
    'hi': 'hawaii',
    'id': 'idaho',
    'il': 'illinois',
    'in': 'indiana',
    'ia': 'iowa',
    'ks': 'kansas',
    'ky': 'kentucky',
    'la': 'louisiana',
    'me': 'maine',
    'mh': 'marshall islands',
    'md': 'maryland',
    'ma': 'massachusetts',
    'mi': 'michigan',
    'mn': 'minnesota',
    'ms': 'mississippi',
    'mo': 'missouri',
    'mt': 'montana',
    'ne': 'nebraska',
    'nv': 'nevada',
    'nh': 'new hampshire',
    'nj': 'new jersey',
    'nm': 'new mexico',
    'ny': 'new york',
    'nc': 'north carolina',
    'nd': 'north dakota',
    'mp': 'northern mariana islands',
    'oh': 'ohio',
    'ok': 'oklahoma',
    'or': 'oregon',
    'pw': 'palau',
    'pa': 'pennsylvania',
    'pr': 'puerto rico',
    'ri': 'rhode island',
    'sc': 'south carolina',
    'sd': 'south dakota',
    'tn': 'tennessee',
    'tx': 'texas',
    'ut': 'utah',
    'vt': 'vermont',
    'vi': 'virgin islands',
    'va': 'virginia',
    'wa': 'washington',
    'wv': 'west virginia',
    'wi': 'wisconsin',
    'wy': 'wyoming'
  };

  const us_states_full_to_abbr = {
    'alabama': 'al',
    'alaska': 'ak',
    'american samoa': 'as',
    'arizona': 'az',
    'arkansas': 'ar',
    'california': 'ca',
    'colorado': 'co',
    'connecticut': 'ct',
    'delaware': 'de',
    'district of columbia': 'dc',
    'federated states of micronesia': 'fm',
    'florida': 'fl',
    'georgia': 'ga',
    'guam': 'gu',
    'hawaii': 'hi',
    'idaho': 'id',
    'illinois': 'il',
    'indiana': 'in',
    'iowa': 'ia',
    'kansas': 'ks',
    'kentucky': 'ky',
    'louisiana': 'la',
    'maine': 'me',
    'marshall islands': 'mh',
    'maryland': 'md',
    'massachusetts': 'ma',
    'michigan': 'mi',
    'minnesota': 'mn',
    'mississippi': 'ms',
    'missouri': 'mo',
    'montana': 'mt',
    'nebraska': 'ne',
    'nevada': 'nv',
    'new hampshire': 'nh',
    'new jersey': 'nj',
    'new mexico': 'nm',
    'new york': 'ny',
    'north carolina': 'nc',
    'north dakota': 'nd',
    'northern mariana islands': 'mp',
    'ohio': 'oh',
    'oklahoma': 'ok',
    'oregon': 'or',
    'palau': 'pw',
    'pennsylvania': 'pa',
    'puerto rico': 'pr',
    'rhode island': 'ri',
    'south carolina': 'sc',
    'south dakota': 'sd',
    'tennessee': 'tn',
    'texas': 'tx',
    'utah': 'ut',
    'vermont': 'vt',
    'virgin islands': 'vi',
    'virginia': 'va',
    'washington': 'wa',
    'west virginia': 'wv',
    'wisconsin': 'wi',
    'wyoming': 'wy'
  };

  const lowerCaseValue = value.toLowerCase();
  if (us_states_full_to_abbr[lowerCaseValue]) {
    field.selectedIndex = [stateIndexMap[us_states_full_to_abbr[lowerCaseValue]]];
  } else if (us_states_abbr_to_full[lowerCaseValue]) {
    field.selectedIndex = [stateIndexMap[lowerCaseValue]];
  }
};
