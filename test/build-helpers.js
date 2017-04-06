/* Contains the unit tests */

var failureCallback = function(data, error) {
  this.equal(!Boolean(data) && error.status === 500, true, "The failure condition is caught successfully");
};

var successCallback = function(data) {
  var result;

  try {
    result = Boolean(data.Envelope)
  } catch(e) {
    result = false;
  }

  this.equal(result, true, "The success condition is successful");
};


QUnit.test('DoCanSearch functions as intended', function(assert) {
});

QUnit.test('DoGetAddress functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doGetAddress), true, "The request can be made");

  EDQ.address.proWeb.doGetAddress({
    moniker: 'USA|5133da03-d155-42b1-aa14-8f7237ae901c|7.610FOUSADwHhBwAAAAABAwEAAAADmDtekgAhEAIYACAAAAAAAAAAAP..AAAAAAD.....AAAAAAAAAAAAAAAAAAAARXhwZXJpYW4A',
    layout: 'EDQDemoLayout',
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doGetAddress({
    moniker: 'dUSA|5133da03-d155-42b1-aa14-8f7237ae901c|7.610FOUSADwHhBwAAAAABAwEAAAADmDtekgAhEAIYACAAAAAAAAAAAP..AAAAAAD.....AAAAAAAAAAAAAAAAAAAARXhwZXJpYW4A',
    layout: 'EDQDemoLayout',
    callback: failureCallback.bind(assert)
  });

});

QUnit.test('DoGetData functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doGetData), true, "The request can be made");
  EDQ.address.proWeb.doGetData({
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doGetData({
    callback: successCallback.bind(assert)
  });
});

QUnit.test('DoGetDataMapDetail functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doGetDataMapDetail), true, "The request can be made");
});

QUnit.test('DoGetExampleAddresses functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doGetExampleAddresses), true, "The request can be made");

  EDQ.address.proWeb.doGetExampleAddresses({
    country: 'USA',
    layout: 'AllElements',
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doGetExampleAddresses({
    country: 'USA',
    layout: 'AllElementsp',
    callback: failureCallback.bind(assert)
  });
});

QUnit.test('DoGetLayouts functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doGetLayouts), true, "The request can be made");

  EDQ.address.proWeb.doGetLayouts({
    country: 'USA',
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doGetLayouts({
    country: 'USAp',
    callback: failureCallback.bind(assert)
  });
});

QUnit.test('DoGetLicenseInfo functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doRefine), true, "The request can be made");
});

QUnit.test('DoPromptSet functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doRefine), true, "The request can be made");

  EDQ.address.proWeb.doGetPromptSet({
    country: 'USA',
    engineOptions: {},
    engineType: 'Verification',
    promptSet: 'Default',
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doGetPromptSet({
    country: 'USA',
    engineOptions: {},
    engineType: 'Verification',
    promptSet: 'Defaultp',
    callback: failureCallback.bind(assert)
  });

});

QUnit.test('DoGetSystemInfo functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doRefine), true, "The request can be made");

  EDQ.address.proWeb.doGetSystemInfo({
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doGetSystemInfo({
    callback: successCallback.bind(assert)
  });

});

QUnit.test('DoRefine functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doRefine), true, "The request can be made");

  EDQ.address.proWeb.doRefine({
    country: 'USA',
    refineOptions: {},
    layout: 'EDQDemoLayout',
    moniker: 'USA|b0a60fcd-9dda-4629-a233-a356d35e9aec|7.610jTUSADwHhBwAAAAACAQAAQAAAAAEAAAD3QQAAAAAAADAyMTEwAA--',
    refinement: '',
    formattedAddressInPicklist: false,
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doRefine({
    country: 'USA',
    refineOptions: {},
    layout: 'EDQDemoLayoutd',
    moniker: 'USA|b0a60fcd-9dda-4629-a233-a356d35e9aec|7.610jTUSADwHhBwAAAAACAQAAQAAAAAEAAAD3QQAAAAAAADAyMTEwAA--',
    refinement: '',
    formattedAddressInPicklist: false,
    callback: failureCallback.bind(assert)
  });

});

QUnit.test('DoSearch functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.address.proWeb.doSearch), true, "The request can be made");

  EDQ.address.proWeb.doSearch({
    country: 'USA',
    engineOptions: {},
    engineType: 'Verification',
    layout: 'EDQDemoLayout',
    addressQuery: '125 Summer Street, Ste 110, Boston MA 02110',
    formattedAddressInPicklist: false,
    callback: successCallback.bind(assert)
  });

  EDQ.address.proWeb.doSearch({
    country: 'USA',
    engineOptions: {},
    engineType: 'Verification',
    layout: 'EDQDemoLayoutd',
    addressQuery: '125 Summer Street, Ste 110, Boston MA 02110',
    formattedAddressInPicklist: false,
    callback: failureCallback.bind(assert)
  });

});
