"use strict";
exports.__esModule = true;
var intern_1 = require("intern");
var keys_1 = require("@theintern/leadfoot/keys");
var registerSuite = intern_1["default"].getInterface('object').registerSuite;
var assert = intern_1["default"].getPlugin('chai').assert;
/* Pages unique for Email Validate Tests */
function fillInPhoneNumber(text) {
    return function () {
        return this.parent
            .findByCssSelector('#phone')
            .type(text)
            .type(keys_1["default"].TAB)
            .end();
    };
}
function checkForMetadata() {
    return function () {
        return this.parent
            .findByCssSelector('#phone')
            .sleep(3000)
            .getAttribute('edq-metadata')
            .then(function (text) {
            assert.equal(true, Boolean(text), 'Phone validate functions');
        });
    };
}
registerSuite('Experian Unicorn - Phone validate Tests', {
    beforeEach: function () {
        return this.remote
            .setFindTimeout(10000)
            .get('localhost:8000/phone-index.html');
    },
    tests: {
        'Phone validate result can be shown': function () {
            return this.remote
                /* experian.com has an Accept-All flag */
                .then(fillInPhoneNumber('9722771455'))
                .then(checkForMetadata());
        }
    }
});
