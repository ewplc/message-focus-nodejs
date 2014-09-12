var _ = require('lodash');

var client = null;

var Workspace = function(id, name, description, ownerUserId, colour) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.ownerUserId = ownerUserId;
  this.colour = colour;

  this.toString = function() {
    return this.id + ") " + this.name + ": " + this.description;
  };
};

function workspaceGet(id, cb) {
  id = Number(id);
  client.methodCall('workspace.get', [id], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, new Workspace(res.id, res.name, res.description, res.owner_user_id, res.colour));
    }
  });
}

function workspaceAll(cb) {
  client.methodCall('workspace.all', [], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, _.map(res, function(w) {
        return new Workspace(w.id, w.name, w.description, w.owner_user_id, w.colour);
      }));
    }
  });
}

function workspaceSearch(q, cb) {
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
  client.methodCall('workspace.search', [searchArgs], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, _.map(res, function(w) {
        return new Workspace(w.id, w.name, w.description, w.owner_user_id, w.colour);
      }));
    }
  });
}

function workspaceCreate(workspace, cb) {
  var create = _.extend({}, workspace);
  create.owner_user_id = create.ownerUserId;
  delete create.ownerUserId;
  create = _.omit(create, function(value, key) {
    if(key === 'id') return true;
    if(_.isNull(value) || _.isUndefined(value) || _.isFunction(value)) return true;
    return false;
  });

  client.methodCall('workspace.create', [create], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, new Workspace(res.id, res.name, res.description, res.owner_user_id, res.colour));
    }
  });
}

function workspaceUpdate(workspace, cb) {
  if(_.isUndefined(workspace.id) || _.isNull(workspace.id)) return cb(new Error("The workspace has no ID"));
  var id = Number(workspace.id);

  var update = _.extend({}, workspace);
  update.owner_user_id = update.ownerUserId;
  delete update.ownerUserId;
  update = _.omit(update, function(value, key) {
    if(key === 'id') return true;
    if(_.isNull(value) || _.isUndefined(value) || _.isFunction(value)) return true;
    return false;
  });

  client.methodCall('workspace.update', [id, update], function(err, res) {
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
  Workspace: Workspace,
  get: workspaceGet,
  all: workspaceAll,
  search: workspaceSearch,
  create: workspaceCreate,
  update: workspaceUpdate
};

module.exports = function(parentClient) {
  client = parentClient;
  return exports;
}