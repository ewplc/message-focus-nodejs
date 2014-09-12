var _ = require('lodash');

var client = null;

function Transaction() {
  this._contact = null;
  this._campaign = null;
  this._data = null;

  this.contact = this.to = function(contact) {
    this._contact = contact;
    return this;
  };

  this.campaign = this.with = function(campaign) {
    this._campaign = campaign;
    return this;
  };

  this.data = function(data) {
    if(_.isObject(data)) {
      this._data = data;
    }
    else {
      throw new Error("Data must be an object");
    }
    return this;
  };

  this.launch = this.send = function(cb) {
    var self = this;
    if(this._contact && this._campaign) {
      if(_.isString(this._contact)) {
        return client.contact.transactional({email: self._contact}, self._campaign, self._data, cb);
      }
      else if(_.isObject(this._contact) || _.isNumber(this._contact)) {
        if(_.isObject(this._contact)) {
          this._contact = this._contact,id;
        }
        return client.contact.transactional(this._contact, this._campaign, this._data, cb);
      }
    }
    else{
      return cb(new Error("You must provide a contact id and campaign id"));
    }
  };
}

module.exports = function(parentClient) {
  client = parentClient;
  return function() {
    return new Transaction();
  };
}