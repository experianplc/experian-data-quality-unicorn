import intern from 'intern';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
const PRO_WEB_AUTH_TOKEN = process.env.PRO_WEB_AUTH_TOKEN;

/* Pages unique for Pro Web Typedown Tests */
function fillInAddressField() {
  return function() {
    return this.parent
      .findByCssSelector('#prompt-input')
        .type('02109')
        .sleep(1000) 
        .end()
      .findByCssSelector('#typedown-results .picklist-item')
        .click()
        .end()
      .findByCssSelector('#prompt-input')
        .type('State St')
        .sleep(1000)
        .end()
      .findByCssSelector('#typedown-results .picklist-item')
        .click()
        .end()
      .findByCssSelector('#prompt-input')
        .type('53')
        .sleep(1000)
        .end()
      .findByCssSelector('#typedown-results .picklist-item')
        .click()
        .end()
      .findByCssSelector('#prompt-input')
        .type('20')
        .sleep(1000)
        .end()
      .findByCssSelector('#typedown-results .picklist-item')
        .click()
        .sleep(1000)
        .end()
      .findByCssSelector('#prompt-select')
        .click()
        .end()
  };
};

function addressPopulated() {
  return function() {
    return this.parent
      .findByCssSelector('#zip')
      .getProperty('value')
      .then((val) => {
        const filled = val.split("-")[1].length > 1;
        assert.equal(true, filled, 'Postal code value populated. Verification functional');
      })
  };
};

registerSuite('Experian Unicorn - Pro Web Typedown Tests', {
  beforeEach: function() {
    return this.remote
      .setFindTimeout(10000)
      .get('localhost:8000/tests/pages/typedown-index.html')
      .execute(function(authToken) {
        window.EdqConfig['PRO_WEB_AUTH_TOKEN'] = authToken;
      }, [PRO_WEB_AUTH_TOKEN])

  },

  tests: {
    'Pro Web Verification works': function () {
      return this.remote
        .findByCssSelector('#address-line-one')
          .click()
          .end()
        .then(fillInAddressField())
        .sleep(1000)
        .then(addressPopulated())
    },
  }

});
