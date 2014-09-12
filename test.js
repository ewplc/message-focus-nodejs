var MessageFocus = require('./index');

var client = new MessageFocus('electric word', 'electric_api', '1m1nAHappyPlac3');
/*
client.workspace.get(47, function(err, workspace) {
  console.log(workspace.name);

  client.project.search({workspace_id: workspace.id}, function(err, projects) {
    console.log(err, projects);
    var project = projects[0];
    client.campaign.search({project_id: project.id}, function(err, campaigns) {
      console.log(err, campaigns);
    });
  });
});
*/
//client.contact.search(1, 'andrew.gilmore@electricwordplc.com', console.log);

client.transactional()
  //.to('andrew.gilmore@electricwordplc.com')
  //.to('darren.shelley@gmail.com')
  .to('andrew.gilmore+api' + Math.floor((Math.random() * 1000) + 1) + '@gmail.com')
  .with(999)
  .data({
    'content':'test without lookup'
  })
  .send(console.log);

/*
client.workspace.all(function(err, workspaces) {
  console.log("All Workspaces", workspaces);
});

client.workspace.search("Testing and Training", function(err, workspaces) {
  console.log("Workspaces matching 'Testing and Training'", workspaces);
});
client.workspace.search(4, function(err, workspaces) {
  console.log("Workspaces owned by user 4", workspaces);
});
*/

/*
client.workspace.create(new client.workspace.Workspace(null, "Andrew Test", "This is a test"), function(err, workspace) {
  console.log("Created", workspace);
});
*/

/*
client.workspace.update(new client.workspace.Workspace(47, "Andrew's Test", "This is a test", 6), function(err, successful) {
  console.log("Updated", successful);
});
*/