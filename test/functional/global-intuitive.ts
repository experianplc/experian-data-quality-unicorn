import intern from 'intern';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');


registerSuite('Experian Unicorn - Global Intuitive Tests', {
  beforeEach: function() {
    return this.remote
      .setFindTimeout(10000)
      .get('../global-intuitive-page/index.html')
      .sleep(20000)
  },

  tests: {
    'Global Intuitive suggestions can be shown': function () {
      return this.remote
        .findByCssSelector('body')
        .getVisibleText()
        .then((text) => {
          assert.equal(
            true,
            false,
            'Verification redirects to settings when settings are not input'
          );
        })
    }
  }

});

