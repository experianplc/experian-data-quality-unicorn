"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserState = (function () {
    function UserState(args, context) {
        this.args = args;
        this.context = context;
    }
    UserState.prototype._setDomState = function () {
        var args = this.args;
        document.getElementById('prompt-text').innerHTML = args['prompt text'];
        document.getElementById('prompt-input').value = args['input value'];
        document.getElementById('typedown-result').innerHTML = args['suggestions'];
        document.getElementById('typedown-previous-steps').innerHTML = args['previous suggestions'];
        ;
    };
    UserState.prototype._fullAddressReset = function () {
        var finalAddressElement = document.getElementById('typedown-final-address');
        if (!finalAddressElement.classList.contains('dn')) {
            document.getElementById('typedown-final-address').classList.add('dn');
            document.getElementById('typedown-result').classList.remove('dn');
            document.getElementById('typedown-previous-steps').classList.remove('dn');
            document.getElementById('prompt-input').removeAttribute('disabled');
        }
    };
    UserState.prototype._afterRevertStateFocus = function () {
        document.getElementById('prompt-input').focus();
        document.getElementById('prompt-input').dispatchEvent(new KeyboardEvent('keyup', { key: '' }));
    };
    UserState.prototype._setEventsPreviousSteps = function () {
        if (document.getElementById('typedown-previous-steps').children.length > 0) {
            for (var i = 0; i < document.getElementById('typedown-previous-steps').children.length; i++) {
                var child = document.getElementById('typedown-previous-steps').children[i];
                child.onclick = this.context._picklistSuggestionOnClick;
            }
        }
    };
    UserState.prototype.revertState = function () {
        var args = this.args;
        this._setDomState();
        this.context.searchMethod = args['search method'];
        this.context.picklistMoniker = args['moniker'];
        this._setEventsPreviousSteps();
        if (args['metadata']._FullAddress === 'true') {
            this._fullAddressReset();
        }
        this._afterRevertStateFocus();
    };
    return UserState;
}());
exports.UserState = UserState;
//# sourceMappingURL=UserState.js.map