
console.log('js');

$(document).ready(OnReady);

function OnReady(){
    $('#addTask').on('click', addNewTask);
    $('#displayList').on('click', '.deleteTaskButton', deleteTasks);
    $('#displayList').on('click', '.completeTaskButton', taskComplete);
    $('#displayList').on('click', '.incompleteTaskButton', taskIncomplete);
    getTasks();
    // $('#displayList').on('click', '.editBtn', editTask);
}

function taskComplete(){
    console.log('in tasks:', $(this).data('id') );
    let objectToSend = {
        completed: false
    };
    $.ajax({
        method: 'PUT',  //make ajax call for updating tasks 
        url: '/tasks?id=' + $(this).data('id'),
        data: objectToSend
    }).then(function(response){
        getTasks(); //refresh new tasks to DOM after changes 
    }).catch(function(err){
        console.log('error updating task:',err);
        alert(`error updating task - see console for more details`);
    });
}

function taskIncomplete(){
    console.log( 'in tasks:', $( this ).data( 'id') );
let objectToSend = {
    completed: true
}

    $.ajax({
        method: 'PUT',
        url: '/tasks?id=' + $( this ).data( 'id' ),
        data: objectToSend
    }).then( function( response ){
        console.log( 'back from update:', response );
        getTasks();
    }).catch( function( err ){
        console.log( err );
        alert( 'error updating task' );
    })
}

function addNewTask(){
    let taskToSend ={
        task: $('#taskIn').val(), //save the new task as an object
        completed: false, //default is always false 
    }
    console.log('post input:', taskToSend);
        $.ajax({    //sending an ajax call to create a new task on the server side
            method: 'POST', 
            url: '/tasks',
            data: taskToSend
        }).then (function(response){
            getTasks();
            $('#taskIn').val(''); //clear out field for next task to be entered 
        }).catch(function(err){
            console.log('error sending task to server', err);
            alert('error sending your task, see console for details');
        });
}


//write a function to get tasks and append to dom 
function getTasks(){
    console.log('in getTasks');
    $.ajax({ //make an ajax call to the GET route
        method: 'GET',
        url: '/tasks'
    }).then (function(response){
        console.log('back from GET route with:,', response);
        //display on DOM
        let el = $('#displayList')
        el.empty();
        for(let i=0; i<response.length; i++){

            let appendCode = '';
            
            //task is complete
            if(response[i].completed === true){
               completed = true;
               taskCompleted = '<button id= "incompleteTaskButton" data-id='+response[i].id+'>🗸</button>'
               }
            //task is not complete
            else {
               completed = false;
               taskCompleted = '<button id="completeTaskButton" data-id='+response[i].id+'>☑</button>'
                     }
        el.append(
        `<tr><td>${response[i].task}</td>
        <td>${completed}</td>
        <td data-id="${ response[i].id }">${taskCompleted}</td>
        <td data-id="${ response[i].id }"><button class = "deleteTaskButton" data-id='+ ${response[i].id} +'>🗑</button></td>
        <td data-id="${ response[i].id }"><button class = "editTaskButton" data-id='+ ${response[i].id} +'>✐</button></td></tr></tr>`
        );
        }
        
    }).catch(function(err){
        console.log('error getting tasks:', err);
        alert('error loading tasks - see console for more details');
    });   
}//end getTasks


function deleteTasks(){
    console.log('in deleteTasks');
//sweet alert 2
    Swal.fire({
        title: 'Are you sure?',
        text: 'once deleted, you will not be able to recover this task',
        icon: 'warning',
        showCancelButton: true, 
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#00ff00',
        denyButtonColor: '#ff0000',
        dangerMode: true,
    })

    .then((results)=>{
        if (results.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: '/tasks?id=' + $(this).data('id')
            }).then(function(response){
                Swal.fire("Good job completing this task!",{
                    icon: "success",
                });
            }).catch(function(err){
                console.log('error deleting task', err);
                alert(`error delting task - see console`);
            })
        } else{
            Swal.fire("Your task is safe!",{
                icon: "error"
            });
        }
    })


} //end deleteTasks

