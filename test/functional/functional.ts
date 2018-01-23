import intern from 'intern';

const { suite, test, before } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite('index', () => {

  test('Pass', async ({ remote }) => {
    assert.strictEqual('one', 'one', 'The numbers are equal');
  });

});
