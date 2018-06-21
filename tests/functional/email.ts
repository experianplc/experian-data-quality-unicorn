import intern from 'intern';
import keys from '@theintern/leadfoot/keys';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
const EMAIL_VALIDATE_AUTH_TOKEN = process.env.EMAIL_VALIDATE_AUTH_TOKEN

/* Pages unique for Email Validate Tests */
function fillInEmailAddress(text: string) {
  return function() {
    return this.parent
      .findByCssSelector('#email')
      .type(text)
      .type(keys.TAB)
      .end()
  };
}

function checkForMetadata() {
  return function() {
      return this.parent
        .findByCssSelector('#email')
        .sleep(3000)
        .getAttribute('edq-metadata')
        .then((text) => {
          assert.equal(true, Boolean(text), "Email validate functions");
        })
    };
}

registerSuite('Experian Unicorn - Email validate Tests', {
  beforeEach: function() {
    return this.remote
      .setFindTimeout(10000)
      .get('localhost:8000/test/pages/email-index.html')
      .execute(function(authToken) {
        window.EdqConfig['EMAIL_VALIDATE_AUTH_TOKEN'] = authToken;
      }, [EMAIL_VALIDATE_AUTH_TOKEN])
  },

  tests: {

    'Email validate result can be shown': function () {
      return this.remote
        /* experian.com has an Accept-All flag */
        .then(fillInEmailAddress('john.doe@experian.com'))
        .then(checkForMetadata())
    }

  }

});
