

console.log('js');

$(document).ready(OnReady);

function OnReady(){
    $('#addTask').on('click', getTasks);
    // $('#displayList').on('click', '.deleteBtn', )
    $('#displayList').on('click', '.deleteButton', deleteTasks);
    addNewTask();
    // $('#displayList').on('click', '.editBtn', editTask);
}

function taskComplete(){
    let idToUpdate = $(this).closest('tr').data('item-id');
    console.log(idToUpdate);
    let status = {
        status: 'done',
    };
    $.ajax({
        method: 'PUT',  //make ajax call for updating tasks 
        url: '/tasks?id=' + $(this).data('id'),
        data: status
    }).then(function(response){
        getTasks(); //refresh new tasks to DOM after changes 
    }).catch(function(err){
        console.log('error updating task:',err);
        alert(`error updating task - see console for more details`);
    });
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
        for(let i=0; i<response.length; i++){
            console.log(response[i].completed);

            const oneTask = response[i];
            
            if(oneTask.status === 'done'){
                $('#displayList').append(
                    `<tr class="taskCompleted" data-item-completed="${oneTask.completed}" data-item-goal="${oneTask.goal}" data-item-id="${oneTask.id}" data-item-task="${oneTask.task}">
                    <td class="checkbox"><input type="checkbox" checked></td>
                    <td>${oneTask.task}</td>
                    <td>${oneTask.goal}</td>
                    <td>${oneTask.completed}</td>
                    <td>button class="btn btn-outline-dark btn-sm editBtn">Edit</button>
                    <button class="deleteBtn btn btn-danger btn-sm">Delete</button></td>
                    <tr>`
                )
            }
            else if (oneTask.status === 'Not done') {
                $('#displayList').append(
                    `<tr data-item-completed="${oneTask.completed}" data-item-goal="${oneTask.goal}" data-item-id="${oneTask.id}" data-item-task=${oneTask.task}">
                    <td class="doneBtnBox><button class="doneBtn btn btn-info btn-sm"> Mark Complete</button></td>
                    <td>${oneTask.task}</td>
                    <td>${oneTask.goal}</td>
                    <td></td>
                    <td>button class="btn btn-outline-dark btn-sm editBtn">Edit</button>
                    <button class="deleteBtn btn btn-danger btn-sm>Delete</button></td>
                    <tr>`
                )
                
                
            }
        
        }
        
    }).catch(function(err){
        console.log('error getting tasks:', err);
        alert('error loading tasks - see console for more details');
    });   
}//end getTasks

function deleteTasks(){
    console.log('in deleteTasks');

    swal({
        title: "Are you sure?",
        text: "once deleted, you will not be able to recover this task",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })

    .then((willDelete)=>{
        if (willDelete) {
            swal("Good job completing this task!",{
                icon: "success",
            });
            $.ajax({
                method: 'DELETE',
                url: '/tasks?id=' + $(this).data('id')
                //?id' + $(this).data('id'),
            }).then(function(response){
                displayAllTasks();
            }).catch(function(err){
                console.log('error deleting task', err);
                alert(`error delting task - see console`);
            })
        } else{
            swal("Your task is safe!",{
                icon: "error"
            });
        }
    })


} //end deleteTasks

