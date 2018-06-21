"use strict";
exports.__esModule = true;
var intern_1 = require("intern");
var registerSuite = intern_1["default"].getInterface('object').registerSuite;
var assert = intern_1["default"].getPlugin('chai').assert;
var GLOBAL_INTUITIVE_AUTH_TOKEN = process.env.GLOBAL_INTUITIVE_AUTH_TOKEN;
/* Pages unique for Global Intuitive Tests */
function fillInAddressField(text) {
    return function () {
        return this.parent
            .findByCssSelector('#address-line-one')
            .type(text)
            .end();
    };
}
function showSuggestions() {
    return function () {
        return this.parent
            .findByCssSelector('#address-line-one')
            .type(' ');
    };
}
function addressPopulated() {
    return function () {
        return this.parent
            .findByCssSelector('#city')
            .getProperty('value')
            .then(function (val) {
            assert.equal(true, Boolean(val), 'City value populated. Global Intuitive functional');
        });
    };
}
registerSuite('Experian Unicorn - Global Intuitive Tests', {
    beforeEach: function () {
        return this.remote
            .setFindTimeout(10000)
            .get('localhost:8000/test/pages/global-intuitive-index.html')
            .execute(function (authToken) {
            window.EdqConfig['GLOBAL_INTUITIVE_AUTH_TOKEN'] = authToken;
        }, [GLOBAL_INTUITIVE_AUTH_TOKEN]);
    },
    tests: {
        'Global Intuitive suggestions can be shown': function () {
            return this.remote
                .then(fillInAddressField('53 State Street'))
                .findByCssSelector('.edq-global-intuitive-address-suggestion')
                .getVisibleText()
                .then(function (text) {
                assert.equal(true, Boolean(text), "Global Intuitive can populate items");
            });
        },
        'Global Intuitive suggestion can be clicked and populate fields': function () {
            return this.remote
                .then(fillInAddressField('53 State Street'))
                .then(showSuggestions())
                .findByCssSelector('.edq-global-intuitive-address-suggestion')
                .click()
                .sleep(3000)
                .end()
                .then(addressPopulated());
        }
    }
});
