var xmlrpc = require("xmlrpc");

var ENDPOINT = "https://app.adestra.com/api/xmlrpc";

var MessageFocus = function(accountName, userName, password) {
  var client = null;

  this.methodCall = function(method, params, cb) {
    if(client === null) {
      client = xmlrpc.createClient({url: ENDPOINT, basic_auth: {user: accountName + '.' + userName, pass: password}});
    }
    console.log("DEBUG", method, params);
    client.methodCall(method, params, cb);
  };

  this.workspace = require("./lib/workspace")(this);
  this.project = require('./lib/project')(this);
  this.campaign = require('./lib/campaign')(this);
  this.contact = require('./lib/contact')(this);

  this.transactional = require('./lib/transactional')(this);
};

module.exports = MessageFocus;