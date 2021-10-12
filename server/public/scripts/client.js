
console.log('js');

$(document).ready(OnReady);

function OnReady(){
    $('#addTask').on('click', addNewTask);
    $('#displayList').on('click', '.deleteTaskButton', deleteTasks);
    $('#displayList').on('click', '.buttonUnchecked', taskComplete);
    $('#displayList').on('click', '.buttonChecked', taskIncomplete);
    getTasks();
  
    // $('#displayList').on('click', '.editBtn', editTask);
}



function taskComplete(){
    let el = $(this)
    el.val('<img class="iconImg" src="./images/checkedBox.png" alt ="Complete Task"></img>')
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
    let el = $(this)
    el.val('<img class="iconImg" src="./images/box.png" alt="Un-complete Task" ></img>')
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

            let uncheckedButton= `<button class="buttonUnchecked" data-id='${response[i].id}'><img class="iconImg" src="./images/box.png" alt="Un-complete Task" ></img></button>`
            let checkedButton= `<button class="buttonChecked" data-id='${response[i].id}'><img class="iconImg" src="./images/checkedBox.png" alt ="CompleteTask"></img></button>`
            //task is complete
            if(response[i].completed === true){
                completed = true;
                taskCompleted = checkedButton
                el.append(
                    `<tr>
                    <td data-id="${ response[i].id }">${taskCompleted}</td>
                    <td class="taskComplete"> ${response[i].task}</td>
                    <td data-id="${ response[i].id }"><button class = "deleteTaskButton" data-id='+ ${response[i].id} +'><img class="iconImg" src="./images/trash.png" alt="Un-Complete Task">
                    </img></button></td>
                    </tr>`
                )
            }
            //task is not complete
            else  {
                completed = false;
                taskCompleted = uncheckedButton
                el.append(
                   `<tr>
                   <td data-id="${ response[i].id }">${taskCompleted}</td>
                   <td class="taskIncomplete"> ${response[i].task}</td>
                   <td data-id="${ response[i].id }"><button class = "deleteTaskButton" data-id='+ ${response[i].id} +'><img class="iconImg" src="./images/trash.png" alt="Un-Complete Task">
                   </img></button></td>
                   </tr>` 
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

