"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * A custom class that implements a queue.
 * In effect this is just a queue, with the caveat that
 * it has a "revertPop" method which does a pop, but also
 * reverts the state to the prior UserState, as well
 */
var UserStates = (function () {
    function UserStates() {
        this.stack = [];
    }
    UserStates.prototype.push = function (state) {
        this.stack.push(state);
    };
    ;
    UserStates.prototype.revertPop = function () {
        var temp = this.stack.pop();
        temp.revertState();
        return temp;
    };
    ;
    UserStates.prototype.pop = function () {
        var userState = this.stack.pop();
        return userState;
    };
    return UserStates;
}());
exports.UserStates = UserStates;
//# sourceMappingURL=UserStates.js.map