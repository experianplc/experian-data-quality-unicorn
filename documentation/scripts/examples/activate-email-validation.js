try {
  new Jotted(document.querySelector('#activate-email-validation'), {
    files: [
      {
        "type": "html",
        "content": `
        <div>Email</div>
        <div>
          <input style="width:80%" id="email" type="email">
        </div>
        <!-- This field isn't necessary, it's just here so you can tab conveniently -->
        <div>Random field</div>
        <div>
          <input style="width:100%" placeholder="Tab into this field to activate email">
        </div>
        `
      },

      {
        "type": "js",
        "content": `

        <!-- An EdqConfig file is imperative for use with EDQ Pegasus and Unicorn -->
        window.EdqConfig = {
          EMAIL_VALIDATE_AUTH_TOKEN: '1793360f-3d97-451a-81b8-d7e765c48894',
          EMAIL_ELEMENTS: [document.getElementById('email')]
        };

        var self = this;
        var a = document.createElement('script');
        a.src = 'http://bossalesdemostaging.qas.com/assets/edq.js';
        a.onload = function() {
          var b = document.createElement('script');
          b.src = 'http://bossalesdemostaging.qas.com/assets/email-unicorn.js';
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
