"use strict";
exports.__esModule = true;
var intern_1 = require("intern");
var registerSuite = intern_1["default"].getInterface('object').registerSuite;
var assert = intern_1["default"].getPlugin('chai').assert;
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
            .getAttribute('value')
            .then(function (val) {
            console.log(val);
            assert.equal(true, Boolean(val), 'City value populated. Global Intuitive functional');
        });
    };
}
registerSuite('Experian Unicorn - Global Intuitive Tests', {
    beforeEach: function () {
        return this.remote
            .setFindTimeout(10000)
            .get('localhost:8000/global-intuitive-index.html');
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
