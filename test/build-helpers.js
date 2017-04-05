/* Contains the unit tests */

QUnit.test('DoSearch functions as intended', function(assert) {
  var successCallback = function(data) {
    assert.equal(true, Boolean(data));
  };

  EDQ.address.proWeb.doSearch({
    country: 'USA',
    engineOptions: {},
    engineType: 'verification',
    layout: 'EDQDemoLayout',
    addressQuery: '125 Summer Street, Ste 110, Boston MA 02110',
    formattedAddressInPicklist: false,
    callback: successCallback
  });
});
