import intern from 'intern';
import keys from '@theintern/leadfoot/keys';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
const GLOBAL_PHONE_VALIDATE_AUTH_TOKEN = process.env.GLOBAL_PHONE_VALIDATE_AUTH_TOKEN;

/* Pages unique for Email Validate Tests */
function fillInPhoneNumber(text: string) {
  return function() {
    return this.parent
      .findByCssSelector('#phone')
      .type(text)
      .type(keys.TAB)
      .end()
  };
}

function checkForMetadata() {
  return function() {
      return this.parent
        .findByCssSelector('#phone')
        .sleep(3000)
        .getAttribute('edq-metadata')
        .then((text) => {
          assert.equal(true, Boolean(text), 'Phone validate functions');
        })
    };
}

registerSuite('Experian Unicorn - Phone validate Tests', {
  beforeEach: function() {
    return this.remote
      .setFindTimeout(10000)
      .get('localhost:8000/phone-index.html')
      .execute(function(authToken) {
        window.EdqConfig['GLOBAL_PHONE_VALIDATE_AUTH_TOKEN'] = authToken;
      }, [GLOBAL_PHONE_VALIDATE_AUTH_TOKEN])

  },

  tests: {

    'Phone validate result can be shown': function () {
      return this.remote
        /* experian.com has an Accept-All flag */
        .then(fillInPhoneNumber('9722771455'))
        .then(checkForMetadata())
    }

  }

});
