var _        = require('underscore');
var usage    = require('cli-usage');
var kyll     = require('./kylltasks.js');
var menu     = require('appendable-cli-menu');

usage();

var readInput = function ask(question, format, callback) {
    var stdin = process.stdin, stdout = process.stdout;
    stdin.resume();
    stdout.write(question + ": ");
    stdin.once('data', function(data) {
       data = data.toString().trim();
       if (format.test(data)) {
           callback(data);
       } else {
           stdout.write("It should match: "+ format +"\n");
           ask(question, format, callback);
       }
   });
}

var handleSelection = function(selection) {
     
     switch(selection) {
        case 0:
           readInput("Input post title", /.+/, function(title) {
               kyll.createPost(title);
               process.exit(0);
           });
           break;
        case 1:
           kyll.clean();
           kyll.build();
           break;
        case 2:
           kyll.clean();
           console.log('Cleaned up');
           break;
        default:
           console.log('Bye Bye.');
           process.exit(0);
    }
};

var optionsMenu = menu('Select Operation', function(selection){
    handleSelection(selection.value);
});

optionsMenu.add({ name: "Create New Post", value: 0 }); 
optionsMenu.add({ name: "Build Site", value: 1 }); 
optionsMenu.add({ name: "Clean-up Directory", value: 2 }); 
optionsMenu.add({ name: "Exit", value: 3 }); 
