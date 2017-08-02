define(function (require) {
  var AbstractPage = require('./abstract-page');
  var _ = require('intern/dojo/node!lodash');
  var sleepTimer = 1000; // milliseconds

  function IndexPage(remote) {
    AbstractPage.apply(this, arguments);
  }

  IndexPage.prototype = Object.create(AbstractPage.prototype);
  IndexPage.prototype.constructor = IndexPage;

  _.extend(IndexPage.prototype, {
    remoteDelegates: ['fillInAddress', 'getAddressLineOne'],

    remoteMethods: {

      /** Clicks submit
       *
       * @returns {undefined}
       */
      clickSubmit: function() {
        return this
          .findById('form-submit')
          .click()
          .end()
        .sleep(sleepTimer)
        .then(function () {
          return true;
        });
      },

      /** Fills in the form with the specified address object
       *
       * @param {Object} address
       * @param {String} address.addressLineOne
       * @param {String} address.addressLineTwo
       * @param {String} address.locality
       * @param {String} address.province
       * @param {String} address.postalCode
       *
       * @returns {undefined}
       */
      fillInAddress: function(address) {
        return this
          .findById('address-line-one')
            .click()
            .clearValue()
            .type(address.addressLineOne || '')
            .end()
          .findById('address-line-two')
            .click()
            .clearValue()
            .type(address.addressLineTwo || '')
            .end()
          .findById('city')
            .click()
            .clearValue()
            .type(address.locality || '')
            .end()
          .findById('state')
            .click()
            .clearValue()
            .type(address.province || '')
            .end()
          .findById('zip')
            .click()
            .clearValue()
            .type(address.postalCode || '')
            .end()
          .then(function () {
            return true;
          });
      },

      /** Returns the address
       *
       * @returns {Object} the address
       */
      getAddress: function() {
        var address = {}
        return this

        .findById('address-line-one')
        .getProperty('value')
        .then(function(text) {
          address['addressLineOne'] = text;
          return true;
        })
        .end()

        .findById('address-line-two')
        .getProperty('value')
        .then(function(text) {
          address['addressLineTwo'] = text;
          return true;
        })
        .end()

        .findById('city')
        .getProperty('value')
        .then(function(text) {
          address['locality'] = text;
          return true;
        })
        .end()


        .findById('state')
        .getProperty('value')
        .then(function(text) {
          address['province'] = text;
          return true;
        })
        .end()

        .findById('zip')
        .getProperty('value')
        .then(function(text) {
          address['postalCode'] = text;
          return address;
        })
      }
    }
  });

  return IndexPage;
});
