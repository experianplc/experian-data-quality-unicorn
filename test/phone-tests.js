/* Contains the unit tests */

var phoneFailCallback = function(data, error) {
  this.assert.equal(!Boolean(data) && error.status !== 200, true, "The failure condition is caught successfully");
  this.done();
};

var phoneCallback = function(data) {
  var result;

  try {
    result = Boolean(data.response)
  } catch(e) {
    result = false;
  }

  this.assert.equal(result, true, "The success condition is successful");
  this.done();
};

QUnit.module('Phone tests');

QUnit.test('PhoneValidatePlus functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.phone.reversePhoneAppend), true, 'The method exists');

  let phoneValidateSuccess = assert.async();
  let phoneValidateFail    = assert.async();

  EDQ.phone.reversePhoneAppend({
    phoneNumber: '+19722771455',
    callback: phoneCallback.bind({assert: assert, done: phoneValidateSuccess})
  });

  EDQ.phone.reversePhoneAppend({
    phoneNumber: 'abc',
    callback: phoneFailCallback.bind({assert: assert, done: phoneValidateFail})
  });

});

QUnit.test('GlobalPhoneValidate functions as intended', function(assert) {
  assert.equal(Boolean(EDQ.phone.globalPhoneValidate), true, 'The method exists');

  let phoneValidateSuccess = assert.async();
  let phoneValidateFail    = assert.async();

  EDQ.phone.globalPhoneValidate({
    phoneNumber: '+19722771455',
    callback: phoneCallback.bind({assert: assert, done: phoneValidateSuccess})
  });

  EDQ.phone.globalPhoneValidate({
    phoneNumber: 'abc',
    callback: phoneFailCallback.bind({assert: assert, done: phoneValidateFail})
  });

});


