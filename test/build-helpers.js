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
