import { UserState } from './UserState';

/*
 * A custom class that implements a queue. 
 * In effect this is just a queue, with the caveat that 
 * it has a "revertPop" method which does a pop, but also
 * reverts the state to the prior UserState, as well
 */
export class UserStates {
  stack: UserState[];

  constructor() {
    this.stack = [];
  }

  push(state: UserState) {
    this.stack.push(state);
  };

  revertPop(): UserState {
    const temp = this.stack.pop();
    temp.revertState();
    return temp;
  };

  pop(): UserState {
    const userState = this.stack.pop();
    return userState;
  }
}
