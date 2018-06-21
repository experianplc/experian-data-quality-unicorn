import intern from 'intern';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
const PRO_WEB_AUTH_TOKEN = process.env.PRO_WEB_AUTH_TOKEN;

/* Pages unique for Pro Web Verification Tests */
function fillInAddressField() {
  return function() {
    return this.parent
      .findByCssSelector('#address-line-one')
        .type('125 Summer Street')
        .end()
      .findByCssSelector('#address-line-two')
        .type('Ste 110')
        .end()
      .findByCssSelector('#city')
        .type('Boston')
        .end()
      .findByCssSelector('#state')
        .type('MA')
        .end()
  };
};

function submitAddress() {
  return function() {
    return this.parent
      .findByCssSelector('#form-submit')
        .click()
        .end()
  }
}

function addressPopulated() {
  return function() {
    return this.parent
      .findByCssSelector('#zip')
      .getProperty('value')
      .then((val) => {
        assert.equal('02110-1685', val, 'Postal code value populated. Verification functional');
      })
  };
}

registerSuite('Experian Unicorn - Pro Web Verification Tests', {
  beforeEach: function() {
    return this.remote
      .setFindTimeout(10000)
      .get('localhost:8000/test/pages/verification-index.html')
      .execute(function(authToken) {
        window.EdqConfig['PRO_WEB_AUTH_TOKEN'] = authToken;
      }, [PRO_WEB_AUTH_TOKEN])

  },

  tests: {
    'Pro Web Verification works': function () {
      return this.remote
        .then(fillInAddressField())
        .then(submitAddress())
        .sleep(1000)
        .then(addressPopulated())
    },
  }

});
