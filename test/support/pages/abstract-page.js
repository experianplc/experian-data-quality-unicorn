/* This page is an "abstract page" that has all of the
 * methods and functions from this.remote attached to it
 * that will be inherited from all subsequent pages.
 */
define(function (require) {
  var Command = require('intern/dojo/node!leadfoot/Command');
  var _ = require('intern/dojo/node!lodash');

  function AbstractPage(remote) {
    this.remote = this._buildRemote(remote);
    this._setRemoteDelegates();
  }

  _.extend(AbstractPage.prototype, {

    /* Remote method names, that will be attached to all page objects */
    remoteDelegates: [],

    /* Extend the remote command of the page with these methods */
    remoteMethods: {},

    /**
     * @param {Object} object - generally this.remote
     *
     * @returns {PageCommand}
     */
    _buildRemote: function(object) {
      function PageCommand() {
        Command.apply(this, arguments);
      }

      PageCommand.prototype = Object.create(Command.prototype);
      PageCommand.prototype.constructor = PageCommand;

      _.extend(PageCommand.prototype, this.remoteMethods);

      return new PageCommand(object);
    },

    /**
     * @returns {Function}
     */
    _setRemoteDelegates: function() {
      this.remoteDelegates.forEach(function(name) {
        this[name] = function delegate() {
          return this.remote[name].apply(this.remote, arguments);
        }
      }, this);
    }
  });

  return AbstractPage;
});
