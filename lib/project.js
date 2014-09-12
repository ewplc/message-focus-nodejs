var _ = require('lodash');

var client = null;

var Project = function(id, workspace, name, description, ownerUserId, colour) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.ownerUserId = ownerUserId;
  this.workspace = workspace;
  this.colour = colour;

  this.toString = function() {
    return this.id + ") " + this.name + ": " + this.description;
  };
};

function projectGet(id, cb) {
  id = Number(id);
  client.methodCall('project.get', [id], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, new Project(res.id, res.workspace_id, res.name, res.description, res.owner_user_id, res.colour));
    }
  });
}

function projectAll(cb) {
  client.methodCall('project.all', [], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, _.map(res, function(w) {
        return new Project(w.id, w.workspace_id, w.name, w.description, w.owner_user_id,  w.colour);
      }));
    }
  });
}

function projectSearch(q, cb) {
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
  console.log()
  client.methodCall('project.search', [searchArgs], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, _.map(res, function(w) {
        return new Project(w.id, w.workspace_id, w.name, w.description, w.owner_user_id,  w.colour);
      }));
    }
  });
}

function projectCreate(project, cb) {
  var create = _.extend({}, project);
  create.owner_user_id = create.ownerUserId;
  delete create.ownerUserId;
  create.workspace_id = create.workspace;
  delete create.workspace;
  create = _.omit(create, function(value, key) {
    if(key === 'id') return true;
    if(_.isNull(value) || _.isUndefined(value) || _.isFunction(value)) return true;
    return false;
  });

  client.methodCall('project.create', [create], function(err, res) {
    if(err) {
      return cb(err);
    }
    else {
      return cb(null, new Project(res.id, res.workspace_id, res.name, res.description, res.owner_user_id,  res.colour));
    }
  });
}

function projectUpdate(project, cb) {
  if(_.isUndefined(project.id) || _.isNull(project.id)) return cb(new Error("The project has no ID"));
  var id = Number(project.id);

  var update = _.extend({}, project);
  update.owner_user_id = update.ownerUserId;
  delete update.ownerUserId;
  update.workspace_id = update.workspace;
  delete update.workspace;
  update = _.omit(update, function(value, key) {
    if(key === 'id') return true;
    if(_.isNull(value) || _.isUndefined(value) || _.isFunction(value)) return true;
    return false;
  });

  client.methodCall('project.update', [id, update], function(err, res) {
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
  Project: Project,
  get: projectGet,
  all: projectAll,
  search: projectSearch,
  create: projectCreate,
  update: projectUpdate
};

module.exports = function(parentClient) {
  client = parentClient;
  return exports;
}