'use strict';

var Store = require('../core/Store');
var Dispatcher = require('../core/Dispatcher');
var ActionTypes = require('../constants/ActionTypes');

/**
 * @typedef Credentials
 * @type {object}
 * @property {string} keyId
 * @property {string} keySecret
 */
var _credentials;


var LOCAL_STORAGE_VAR = 'scalrCredentials';


var fromLocalStorage = function () {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return JSON.parse(localStorage[LOCAL_STORAGE_VAR]);
};

var toLocalStorage = function (credentials) {
  localStorage[LOCAL_STORAGE_VAR] = JSON.stringify(credentials);
};


var CredentialsStore = new Store({

  /**
   * @returns {Credentials}
   */
  get() {
    // TODO - Error handling!
    return _credentials || fromLocalStorage() || require('../constants/Settings').defaults.credentials;
  },

  set(credentials) {
    _credentials = credentials;
    toLocalStorage(credentials);
  }

});

CredentialsStore.dispatcherToken = Dispatcher.register(payload => {

  var action = payload.action;

  if (action.actionType == ActionTypes.SET_CREDENTIALS) {
    CredentialsStore.set(action.credentials);
    CredentialsStore.emitChange();
  }

});

module.exports = CredentialsStore;
