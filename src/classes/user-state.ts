export class UserState {
  args: UserStateInterface;
  context: any;

  constructor(args: UserStateInterface, context: any) {
    this.args = args;
    this.context = context;
  }

  private _setDomState() {
    let args = this.args;
    document.getElementById('prompt-text').innerHTML = args['prompt text'] ;
    document.getElementById('prompt-input').value = args['input value'];
    document.getElementById('typedown-result').innerHTML = args['suggestions'];
    document.getElementById('typedown-previous-steps').innerHTML = args['previous suggestions'];;
  }

  private _fullAddressReset() {
    let finalAddressElement = document.getElementById('typedown-final-address');
    if (!finalAddressElement.classList.contains('dn')) {
      document.getElementById('typedown-final-address').classList.add('dn');
      document.getElementById('typedown-result').classList.remove('dn');
      document.getElementById('typedown-previous-steps').classList.remove('dn');
      document.getElementById('prompt-input').removeAttribute('disabled');
    }
  }

  private _afterRevertStateFocus() {
    document.getElementById('prompt-input').focus();
    document.getElementById('prompt-input').dispatchEvent(new KeyboardEvent('keyup', { key: '' }));
  }

  private _setEventsPreviousSteps() {
    if (document.getElementById('typedown-previous-steps').children.length > 0) {
      for (let i = 0; i < document.getElementById('typedown-previous-steps').children.length; i++ ) {
        let child = document.getElementById('typedown-previous-steps').children[i];
        child.onclick = this.context._picklistSuggestionOnClick;
      }
    }
  }

  revertState() {
    let args = this.args;
    this._setDomState();

    this.context.setSearchMethod(args['search method']);
    this.context.setPicklistMoniker(args['moniker']);
    this._setEventsPreviousSteps();

    if (args['metadata']._FullAddress === 'true') {
      this._fullAddressReset();
    }

    this._afterRevertStateFocus();
  }
}
