const fs = require('fs');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter) 
// const lodash = require('lodash')
const { program} = require('commander');
program.version('0.0.1');


// Set some defaults
db.defaults({ ToDos: []})
  .write()

var sts = ["todo", "in-progress", "done"];

///1 - Users can add entry
program
  .command('add')
  .option('-t, --title <title>', 'todo title')
  .action((options) => {

        console.log(options);

        var counter = db.get('ToDos')
                        .size()
                        .value()

        db.get('ToDos')
        .push({ id: counter+1 , title: options.title , status: "todo"})
        .write()
});

///2 - Users Can list Entries
program
  .command('list')
  .option('-s, --status <status>', 'status code')
  .action((options) => {
    if(options.status && sts.includes(options.status)){ //if status option enetered (bonus #3)
        console.log(
          db.get('ToDos')
          // .find({status: options.status})  //only get the first matched record
          .filter({status: options.status})
          .value()
          )
    }else if(!options.status){//if no option entered
        console.log(
          db.get('ToDos')
          .value()
        )
    }
    else{ ///if option status was entered wrong
      console.log(`the Todo status should be one of ${sts}`);

    }
});

///3 - Users can edit their entry through the id
program
  .command('edit')
  .option('-s, --status <status>', 'status code')
  .option('-t, --title <title>', 'todo title')
  .requiredOption('-i, --id <id>', 'todo id')
  .action((options) => {
    if(options.title && options.status && sts.includes(options.status)){
        console.log(options);

        db.get('ToDos')
        .find({ id: parseInt(options.id) })
        .assign({ title: `${options.title}`})
        .assign({ status: `${options.status}`})
        .write()

        console.log("the Todo title & status was edited");
    }
    else if(options.title){
        console.log(options);

        db.get('ToDos')
        .find({ id: parseInt(options.id) })
        .assign({ title: `${options.title}`})
        .write()

        console.log("the Todo title was edited");
    }
    else if(options.status && sts.includes(options.status)){
        console.log(options);

        db.get('ToDos')
        .find({ id: parseInt(options.id) })
        .assign({ status: `${options.status}`})
        .write()
        console.log("the Todo status was edited");
    }
    else if(!options.status ){
        db.get('ToDos')
        .find({ id: parseInt(options.id) })
        .assign({ status: `done`})
        .write()
        console.log("the Todo status was edited to done");
    ////if status not ["todo", "in-progress", "done"] or undefined
    }else{
        console.log(`the Todo status should be one of ${sts}`);
    }
    
});

///4 - Users can delete their entry using their id
program
  .command('delete <id>')
  .action((options) => {
        console.log(options);

        db.get('ToDos')
        .remove({ id: parseInt(options) })
        .write()

        ///bug not required
        console.log("the Todo was deleted");
    
});


////bonus
///1 - Entries is added by default with status property which has “to-do” value
///2- edit (modified)
////3-list (modified)




program.parse(process.argv);
// const options = program.opts();





// if (options.title) {
//     // fs.appendFile('./To-Do-List.txt',`ToDo# ${counter}: ${options.title}\n`,()=>{
//     //     console.log(`To-Do ${counter} was added`)
//     // })


















