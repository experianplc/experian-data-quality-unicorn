"use strict";
exports.__esModule = true;
var intern_1 = require("intern");
var registerSuite = intern_1["default"].getInterface('object').registerSuite;
var assert = intern_1["default"].getPlugin('chai').assert;
var PRO_WEB_AUTH_TOKEN = process.env.PRO_WEB_AUTH_TOKEN;
;
var correctAddress = {
    addressLineOne: '125 Summer Street',
    addressLineTwo: 'Ste 110',
    city: 'Boston',
    state: 'MA'
};
var incorrectAddress = {
    addressLineOne: 'fake street',
    zipCode: '12345'
};
var interactionRequiredAddress = {
    addressLineOne: '31 Mead',
    zipCode: '01002'
};
var multipleAddress = {
    addressLineOne: '316 E 92nd Street',
    state: 'New York',
    city: 'New York'
};
var streetPartialAddress = {
    addressLineOne: 'Prospect Street',
    zipCode: '02171'
};
/* Pages unique for Pro Web Verification Tests */
function fillInAddressField(addressObject) {
    var addressLineOne = addressObject.addressLineOne, addressLineTwo = addressObject.addressLineTwo, city = addressObject.city, state = addressObject.state, zipCode = addressObject.zipCode;
    return function () {
        return this.parent
            .findByCssSelector('#address-line-one')
            .type(addressLineOne || '')
            .end()
            .findByCssSelector('#address-line-two')
            .type(addressLineTwo || '')
            .end()
            .findByCssSelector('#city')
            .type(city || '')
            .end()
            .findByCssSelector('#state')
            .type(state || '')
            .end()
            .findByCssSelector('#zip')
            .type(zipCode || '')
            .end();
    };
}
;
function submitAddress() {
    return function () {
        return this.parent
            .findByCssSelector('#form-submit')
            .click()
            .end();
    };
}
function addressPopulated(selector, value, assertionMessage) {
    return function () {
        return this.parent
            .findByCssSelector(selector)
            .getProperty('value')
            .then(function (val) {
            assert.equal(value, val, assertionMessage);
        });
    };
}
registerSuite('Experian Unicorn - Pro Web Verification Tests', {
    beforeEach: function () {
        return this.remote
            .setFindTimeout(10000)
            .get('localhost:8000/tests/pages/verification-index.html')
            .sleep(2000)
            .execute(function (authToken) {
            window.EdqConfig['PRO_WEB_AUTH_TOKEN'] = authToken;
        }, [PRO_WEB_AUTH_TOKEN]);
    },
    tests: {
        'Automatic verification works': function () {
            return this.remote
                .then(fillInAddressField(correctAddress))
                .then(submitAddress())
                .sleep(1000)
                .then(addressPopulated('#zip', '02110-1685', 'Postal Code value populated. Automatic verification functional'));
        },
        'Interaction required functions': function () {
            return this.remote
                .then(fillInAddressField(interactionRequiredAddress))
                .then(submitAddress())
                .sleep(1000)
                .findByCssSelector('#interaction--use-updated')
                .click()
                .end()
                .then(addressPopulated('#zip', '01002-1786', 'Postal Code value populated. Interaction required functional'));
        },
        'Multiple address workflow functions': function () {
            return this.remote
                .then(fillInAddressField(multipleAddress))
                .then(submitAddress())
                .sleep(1000)
                .findByCssSelector('#interaction-address--select-field')
                .click()
                .end()
                .findByCssSelector('.edq-global-intuitive-address-suggestion')
                .click()
                .end()
                .sleep(1000)
                .then(addressPopulated('#zip', '10128-5451', 'Postal Code value populated. Multiple address functional'));
        }
    }
});
