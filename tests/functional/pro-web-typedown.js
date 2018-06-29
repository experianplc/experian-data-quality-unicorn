"use strict";
exports.__esModule = true;
var intern_1 = require("intern");
var registerSuite = intern_1["default"].getInterface('object').registerSuite;
var assert = intern_1["default"].getPlugin('chai').assert;
var PRO_WEB_AUTH_TOKEN = process.env.PRO_WEB_AUTH_TOKEN;
/* Pages unique for Pro Web Typedown Tests */
function fillInAddressField() {
    return function () {
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
            .end();
    };
}
;
function addressPopulated() {
    return function () {
        return this.parent
            .findByCssSelector('#zip')
            .getProperty('value')
            .then(function (val) {
            assert.equal('02109-3204', val, 'Postal code value populated. Verification functional');
        });
    };
}
;
registerSuite('Experian Unicorn - Pro Web Verification Tests', {
    beforeEach: function () {
        return this.remote
            .setFindTimeout(10000)
            .get('localhost:8000/tests/pages/typedown-index.html')
            .execute(function (authToken) {
            window.EdqConfig['PRO_WEB_AUTH_TOKEN'] = authToken;
        }, [PRO_WEB_AUTH_TOKEN]);
    },
    tests: {
        'Pro Web Verification works': function () {
            return this.remote
                .findByCssSelector('#address-line-one')
                .click()
                .end()
                .then(fillInAddressField())
                .sleep(1000)
                .then(addressPopulated());
        }
    }
});
