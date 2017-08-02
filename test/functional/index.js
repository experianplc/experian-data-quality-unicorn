define(function (require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var IndexPage = require('../support/pages/index-page');
  var _ = require('intern/dojo/node!lodash');


  var sleepTimer = 750; // milliseconds

  registerSuite(function() {
    var indexPage;

    return {
      setup: function() {
        indexPage = new IndexPage(this.remote);
      },

      beforeEach: function() {
        return this.remote
          .get(require.toUrl('../../index.html'))
          .setFindTimeout(50000)
      },

      'Multiple workflow is functional': function() {
        return indexPage
          .fillInAddress({
            addressLineOne: '4440 Image',
            locality: 'Dallas',
            province: 'TX'
          })

          .clickSubmit()
          .findById('interaction-address--prompt')
          .getVisibleText()

          .then(function(text) {
            assert.equal(text, "Please choose from the options below", "Prompt is correct");
          })
      },

      'Premise partial workflow is functional': function() {
        return indexPage
          .fillInAddress({
            addressLineOne: '1889 broadway',
            locality: 'San Francisco',
            province: 'Ca',
            postalCode: '94109'
          })

          .clickSubmit()
          .findById('interaction-address--prompt')
          .getVisibleText()

          .then(function(text) {
            assert.equal(text, "Please confirm your Apt/Ste/Unit Number", "Prompt is correct");
          })
      },

      'Street partial workflow is functional': function() {
        return indexPage
          .fillInAddress({
            addressLineOne: '100 Eliot',
            locality: 'arlington',
            province: 'ma',
            postalCode: '02474'
          })

          .clickSubmit()
          .findById('interaction-address--prompt')
          .getVisibleText()

          .then(function(text) {
            assert.equal(text, "Please confirm your building number", "Prompt is present");
          })
      },

      'Verified workflow is functional': function() {
        var address = {
          addressLineOne: '1889 BROADWAY',
          locality: 'San Francisco',
          province: 'CA',
          postalCode: '94109-2276'
        };

        return indexPage
        .fillInAddress(address)
        .clickSubmit()
        .getAddress()
        .then(function(changedAddress) {
          assert.equal(true, address['addressLineOne'] != changedAddress['addressLineOne'], 'Address line one changed');
        })
      },

      'Unverified workflow is functional': function() {
        var address = {
          addressLineOne: '',
          locality: '',
          province: '',
          postalCode: ''
        };

        return indexPage
        .fillInAddress(address)
        .clickSubmit()
        .findById('edq-modal-header')
        .getVisibleText()
        .then(function(header) {
          assert.equal(header, 'Confirm unverified address', 'Unverified prompt is shown');
        })
      },


      'Interaction required workflow is functional': function() {
        return indexPage
          .fillInAddress({
            addressLineOne: '19 Cook',
            locality: 'Portland',
            province: 'OR',
          })

          .clickSubmit()
          .findById('interaction-address--interaction-prompt')
          .getVisibleText()
          .then(function(text) {
            assert.equal(text, 'Updated address', 'Prompt is present');
          })
      },

      'Selecting an item works (Multiple/StreetPartial/PremisePartial)': function() {},
      'Confirming an address works (Interaction Required)': function() {}
    }
  });
});
