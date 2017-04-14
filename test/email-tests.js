/* Contains the unit tests */

var emailFailCallback = function(data, error) {
  this.assert.equal(!Boolean(data) && error.status !== 200, true, "The failure condition is caught successfully");
  this.done();
};

var emailCallback = function(data) {
  var result;

  try {
    result = Boolean(data)
  } catch(e) {
    result = false;
  }

  this.assert.equal(result, true, "The success condition is successful");
  this.done()
};

QUnit.module('Email tests');

QUnit.test('EmailValidate functions as intended', function(assert) {
  var emailValidateSuccess = assert.async();
  var emailValidateFail    = assert.async();

  assert.equal(Boolean(EDQ.email.emailValidate), true, 'The method exists');

  EDQ.email.emailValidate({
    emailAddress: 'support@edq.com',
    callback: emailCallback.bind({assert: assert, done: emailValidateSuccess})
  });

  EDQ.email.emailValidate({
    emailAddress: '',
    callback: emailFailCallback.bind({assert: assert, done: emailValidateFail})
  });

});
