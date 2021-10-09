console.log('js');

$(document).ready(OnReady);
function OnReady(){
    getTasks();
    setupClickListeners();
}// end OnReady

function setupClickListeners(){
    $('#add_button').on('click', addNewTask);
    $('#outputUL').on('click', '.checkButtonUnchecked', {param: true}, toggleCheck);
    $('#outputUL').on('click', '.checkButtonChecked', {param: false}, toggleCheck);
    $('#outputUL').on('click', '.deleteBtn', removeTask);
}

function toggleCheck(_isComplete){
    let isComplete= _isComplete.data.param; //
    let objectToSend ={
        completed: isComplete
    }

    $.ajax({
        method: 'PUT',  //make ajax call for updating tasks 
        url: '/tasks?id=' + $(this).data('id'),
        data: objectToSend
    }).then(function(response){
        getTasks(); //refresh new tasks to DOM after changes 
    }).catch(function(err){
        console.log('error updating task:' err);
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
        let ready = ""
        let outputArea= $('#outputUL'); //where are things going to display 
        outputArea.empty(); 

        for(let i=0; i<response.length; i++){
            let stringToAppend = '<ul class="task">';
            console.log(response[i].completed);
        
            if(response[i].completed{
                stringToAppend += `<button class="iconButton checkButton checkButtonChecked" data-id='${response[i].id}'>
                <img class="iconImg" src=`
            })
        }
        
    }      
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
                url: '/tasks?id' + $(this).data('id'),
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