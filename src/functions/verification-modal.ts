export function generateModal(mode) {
    return `<div class="edq-overlay" id="edq-overlay">
      <div class="w-100 w-50-ns center ba v-top v-mid-ns mt4-m mt6-l">
        <div class="edq-modal-header-color ph3 pv2 tc">
          <div id="edq-close-modal" class="pointer f6 fw6 fr pv2 ph2">
            x
          </div>
          <h2 id="edq-modal-header">${mode == undefined ? 'Confirm unverified address' : 'Confirm updated address'}</h2>
        </div>

        <div class="bg-white cf ph4 pb4">
          <div id="segment--interaction-search" class="fl w-100 w-50-ns ${(mode === 'Multiple') || (mode === 'StreetPartial') || (mode === 'PremisesPartial') ? '' : 'edq-hide'}">
            <div id="interaction-address" class="pa2">
              <h4 id="interaction-address--prompt"></h4>
              <input id="interaction-address--select-field" class="w-100 w-90-ns"></input>
            </div>
          </div>

          <div id="segment--interaction" class="fl w-100 w-50-ns ${mode === 'InteractionRequired' ? '' : 'edq-hide'}">
            <div id="interaction-address" class="h4 pa2">
              <h4 id="interaction-address--interaction-prompt">Updated address</h4>
              <div id="interaction-address--address-line-one"></div>
              <div id="interaction-address--address-line-two"></div>
              <div id="interaction-address--locality"></div>
              <div id="interaction-address--province"></div>
              <div id="interaction-address--postal-code"></div>
            </div>
          </div>

          <div id="segment--use-original" class="fl w-100 w-50-ns">
            <div id="interaction-address-original" class="h4 pa2">
              <h4>Original address</h4>
              <div id="interaction-address--original-address-line-one"></div>
              <div id="interaction-address--original-address-line-two"></div>
              <div id="interaction-address--original-locality"></div>
              <div id="interaction-address--original-province"></div>
              <div id="interaction-address--original-postal-code"></div>
            </div>
          </div>

          <div class="cf">
            <div class="fl mt3 mt4-ns w-100 w-50-ns">
              <button id="interaction--use-updated" class="pointer ba pa2 w-100 mt3-m w-auto-ns ${mode === 'InteractionRequired' ? '' : 'edq-hide'}">
                Use updated address
              </button>
            </div>

            <div class="fl mt3 mt4-ns w-100 ${mode == undefined ? '' : 'w-50-ns'}">
              <button id="interaction--use-original" class="pointer ba pa2 w-100 mt3-m ">
                Use original address
              </button>
            </div>
          </div>
        </div>
        </div>`
  }
