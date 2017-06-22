try {
  new Jotted(document.querySelector('#activate-global-intuitive-validation'), {
    files: [
      {
        "type": "html",
        "content": `
        <form>
          <div>
            <div>Address Line One</div>
            <input style="width:100%" id="address-line-one" type="text">
          </div>

          <div>
            <div>Address Line Two</div>
            <input style="width:100%" id="address-line-two" type="text">
          </div>

        </form>
        `
      },

      {
        "type": "js",
        "content": `

        // An EdqConfig file is imperative for use with EDQ Pegasus and Unicorn
        window.EdqConfig = {
          DEBUG: true,

          /** Authorization tokens **/

          /* Address */
          GLOBAL_INTUITIVE_AUTH_TOKEN: '8c9faaa4-a5d2-4036-808d-11208a2e52d8',

          /* Global Intuitive Options */
          GLOBAL_INTUITIVE_ELEMENT: document.getElementById('address-line-one'),

          GLOBAL_INTUITIVE_MAPPING: [
            {
              field: document.getElementById('address-line-one'),
              elements: ['address.addressLine1', 'address.addressLine2'],
              separator: ', '
            },

            {
              field: document.getElementById('address-line-two'),
              elements: ['address.addressLine2']
            },

            {
              field: document.getElementById('address-line-three'),
              elements: []
            },

            {
              field: document.getElementById('city'),
              elements: [],
            },

            {
              field: document.getElementById('locality'),
              elements: []
            },

            {
              field: document.getElementById('postalCode'),
              elements: []
            },

            {
              field: document.getElementById('province'),
              elements: []
            },

            {
              field: document.getElementById('country'),
              elements: []
            }
          ]

        };

        var self = this;
        var a = document.createElement('script');
        a.src = 'http://bossalesdemostaging.qas.com/assets/edq.js';
        a.onload = function() {
          var c = document.createElement('link');
          c.type = 'text/css';
          c.rel = 'stylesheet';
          c.href = 'http://bossalesdemostaging.qas.com/assets/global-intuitive-unicorn.css';
          self.document.body.appendChild(c);

          var b = document.createElement('script');
          b.src = 'http://bossalesdemostaging.qas.com/assets/global-intuitive-unicorn.js';
          self.document.body.appendChild(b);
        };

        self.document.body.appendChild(a);
        `
      },
    ],

    plugins: [
      'stylus',
      {
        name: 'ace',
      }
    ]
  });
} catch(e) {
}
