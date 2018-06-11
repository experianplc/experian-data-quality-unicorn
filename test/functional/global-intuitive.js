"use strict";
exports.__esModule = true;
var intern_1 = require("intern");
var registerSuite = intern_1["default"].getInterface('object').registerSuite;
var assert = intern_1["default"].getPlugin('chai').assert;
registerSuite('Experian Unicorn - Global Intuitive Tests', {
    beforeEach: function () {
        return this.remote
            .setFindTimeout(10000)
            .get('../global-intuitive-page/index.html')
            .sleep(20000);
    },
    tests: {
        'Global Intuitive suggestions can be shown': function () {
            return this.remote
                .findByCssSelector('body')
                .getVisibleText()
                .then(function (text) {
                assert.equal(true, false, 'Verification redirects to settings when settings are not input');
            });
        }
    }
});
