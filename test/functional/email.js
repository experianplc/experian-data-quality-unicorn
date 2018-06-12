"use strict";
exports.__esModule = true;
var intern_1 = require("intern");
var keys_1 = require("@theintern/leadfoot/keys");
var registerSuite = intern_1["default"].getInterface('object').registerSuite;
var assert = intern_1["default"].getPlugin('chai').assert;
/* Pages unique for Email Validate Tests */
function fillInEmailAddress(text) {
    return function () {
        return this.parent
            .findByCssSelector('#email')
            .type(text)
            .type(keys_1["default"].TAB)
            .end();
    };
}
function checkForMetadata() {
    return function () {
        return this.parent
            .findByCssSelector('#email')
            .sleep(3000)
            .getAttribute('edq-metadata')
            .then(function (text) {
            assert.equal(true, Boolean(text), "Email validate functions");
        });
    };
}
registerSuite('Experian Unicorn - Email validate Tests', {
    beforeEach: function () {
        return this.remote
            .setFindTimeout(10000)
            .get('localhost:8000/email-index.html');
    },
    tests: {
        'Email validate result can be shown': function () {
            return this.remote
                /* experian.com has an Accept-All flag */
                .then(fillInEmailAddress('john.doe@experian.com'))
                .then(checkForMetadata());
        }
    }
});
