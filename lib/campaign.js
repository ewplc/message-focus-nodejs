var _ = require('lodash');

var client = null;

var Campaign = function(id, projectId, name, description, ownerUserId, colour) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.ownerUserId = ownerUserId;
  this.project = projectId;
  this.colour = colour;

  this.toString = function() {
    return this.id + ") " + this.name + ": " + this.description;
  };
};

function campaignGet(id, cb) {
  id = Number(id);
  client.methodCall('campaign.get', [id], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, new Campaign(res.id, res.project_id, res.name, res.description, res.owner_user_id, res.colour));
    }
  });
}

function campaignAll(cb) {
  client.methodCall('campaign.all', [], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, _.map(res, function(w) {
        return new Campaign(w.id, w.project_id, w.name, w.description, w.owner_user_id, w.colour);
      }));
    }
  });
}

function campaignSearch(q, cb) {
  var searchArgs = {};
  if(_.isNumber(q)) {
    searchArgs.owner_user_id = q;
  }
  else if(_.isString(q)) {
    searchArgs.name = q;
  }
  else {
    searchArgs = q;
  }
  client.methodCall('campaign.search', [searchArgs], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, _.map(res, function(w) {
        return new Campaign(w.id, w.project_id, w.name, w.description, w.owner_user_id, w.colour);
      }));
    }
  });
}

function campaignCreate(campaign, cb) {
  var create = _.extend({}, campaign);
  create.owner_user_id = create.ownerUserId;
  delete create.ownerUserId;
  create.project_id = create.project;
  delete create.project;
  create = _.omit(create, function(value, key) {
    if(key === 'id') return true;
    if(_.isNull(value) || _.isUndefined(value) || _.isFunction(value)) return true;
    return false;
  });

  client.methodCall('campaign.create', [create], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, new Campaign(res.id, res.project_id, res.name, res.description, res.owner_user_id, res.colour));
    }
  });
}

function campaignUpdate(campaign, cb) {
  if(_.isUndefined(campaign.id) || _.isNull(campaign.id)) return cb(new Error("The campaign has no ID"));
  var id = Number(campaign.id);

  var update = _.extend({}, campaign);
  update.owner_user_id = update.ownerUserId;
  delete update.ownerUserId;
  update.project_id = update.project;
  delete update.project;
  update = _.omit(update, function(value, key) {
    if(key === 'id') return true;
    if(_.isNull(value) || _.isUndefined(value) || _.isFunction(value)) return true;
    return false;
  });

  client.methodCall('campaign.update', [id, update], function(err, res) {
    console.log(err);
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, res === 1);
    }
  });
}

var exports = {
  Campaign: Campaign,
  get: campaignGet,
  all: campaignAll,
  search: campaignSearch,
  create: campaignCreate,
  update: campaignUpdate
};

module.exports = function(parentClient) {
  client = parentClient;
  return exports;
}