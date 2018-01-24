export function modal() {
  return `<div class="edq-overlay" id="edq-overlay">
      <div id="edq-modal" class="w-75 center v-top v-mid-ns mt4-m mt6-l">
        <div class="bg-black-10">
          <!-- New/Back, Mode, and Datamap -->
          <div class="pl3 pt3">
            <span>
              <button id="edq-modal-new" class="pointer pl1">New</button>
              <button id="edq-modal-back" class="pointer pr1">Back</button>
            </span>

            |

            <input type="radio" name="verification-mode" value="typedown">Typedown</input>

            | Datamap:
            <select>
              <option>United States of America</option>
            </select>

            <span id="edq-close-modal"
                  class="bg-black b white pointer fr ba f5 ph1 mr3">
              x
            </span>
          </div>

          <div class="pa2 bb b--black-10"></div>

          <!-- Prompt and selection field -->
          <div class="pl3 mt3 pb3">
            <div id="prompt-text" class="b">Enter ZIP code, city name, county name or state code</div>
            <input id="prompt-input">
            <button id="prompt-select" class="pointer">Select</button>
          </div>
        </div>

        <!-- Current steps -->
        <div id="typedown-steps" class="h5 ba">
          <div id="typedown-previous-steps">
          </div>

          <div id="typedown-result" class="ml4">
            Continue typing (too many matches)
          </div>

          <div id="typedown-final-address" class="ml4 dn">
            <div>
              <span class="dib w-10">Address Line One</span>
              <span class="dib w-80"><input class="w-100" id="typedown-final--address-line-one"></span>
            </div>
            <div>
              <span class="dib w-10">Address Line Two</span>
              <input class="dib w-80" id="typedown-final--address-line-two">
            </div>
            <div>
              <span class="dib w-10">City</span>
              <input class="dib w-80" id="typedown-final--city">
            </div>
            <div>
              <span class="dib w-10">State</span>
              <input class="dib w-80" id="typedown-final--state">
            </div>
            <div>
              <span class="dib w-10">Postal Code</span>
              <input class="dib w-80" id="typedown-final--postal-code">
            </div>
            <div>
              <span class="dib w-10">Country Code</span>
              <input class="dib w-80" id="typedown-final--country-code">
            </div>
          </div>
        </div>

        <!-- Number of matches -->
        <div class="cf bg-black-10 h-100">
          <span class="fr mr5">| Matches: <span id="picklist-matches-count">1</span></span>
        </div>
      </div>`;
};
