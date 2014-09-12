var _ = require('lodash');

var client = null;

var Contact = function(id, email) {
  this.id = id;
  this.email = email

  this.toString = function() {
    return this.email;
  };
};

function contactGet(id, cb) {
  id = Number(id);
  client.methodCall('contact.get', [id], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, new Contact(res.id, res.email));
    }
  });
}

function contactSearch(tableId, q, cb) {
  var searchArgs = {};
  if(_.isString(q)) {
    searchArgs.email = q;
  }
  else {
    searchArgs = q;
  }
  client.methodCall('contact.search', [tableId, searchArgs], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, _.map(res, function(w) {
        return new Contact(w.id, w.email);
      }));
    }
  });
}

function contactTransactional(contact, campaign, transactionData, cb) {
  if(contact instanceof Contact) {
    contact = contact.id;
  }
  if(campaign instanceof client.campaign.Campaign) {
    campaign = campaign.id;
  }
  client.methodCall('contact.transactional', [contact, Number(campaign), transactionData], function(err, res){
    return cb(err, res === 1);
  });
}

var exports = {
  Contact: Contact,
  get: contactGet,
  search: contactSearch,
  transactional: contactTransactional
};

module.exports = function(parentClient) {
  client = parentClient;
  return exports;
}