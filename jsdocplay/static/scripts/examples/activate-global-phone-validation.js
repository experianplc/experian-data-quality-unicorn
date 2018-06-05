try {
  new Jotted(document.querySelector('#activate-global-phone-validation'), {
    files: [
      {
        "type": "html",
        "content": `
        <div>Phone</div>
        <div>
          <input style="width:80%" id="phone" onchange="console.log('Phone validated')" type="tel">
        </div>
        <!-- This field isn't necessary, it's just here so you can tab conveniently -->
        <div>Random field</div>
        <div>
          <input style="width:80%" placeholder="Tab into this field to activate global phone validation">
        </div>
        `
      },

      {
        "type": "js",
        "content": `

        // An EdqConfig file is imperative for use with EDQ Pegasus and Unicorn
        window.EdqConfig = {
          GLOBAL_PHONE_VALIDATE_AUTH_TOKEN: '1793360f-3d97-451a-81b8-d7e765c48894',
          PHONE_ELEMENTS: [document.getElementById('phone')],
        };

        var self = this;
        var a = document.createElement('script');
        a.src = 'http://bossalesdemostaging.qas.com/assets/edq.js';
        a.onload = function() {
          var b = document.createElement('script');
          b.src = 'http://bossalesdemostaging.qas.com/assets/phone-unicorn.js';
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
