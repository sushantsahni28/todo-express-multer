var element = document.getElementById("list")

function saveData(){
    var text = document.getElementById("task").value.trim()
    if(text == ""){
        alert("Enter a task!!")
        return
    }
    var pic = document.getElementById("picture")
    if(!pic.files[0]){
        alert("Upload a picture!!")
        return
    }
    else if(pic.files[0].type.split("/")[0] !== "image"){
        alert("Uploaded file is not a picture!!")
        return
    }

    //console.log(pic.files[0])
    const formData = new FormData()

    formData.append("task",text)
    formData.append("picture", pic.files[0]);

    const request = new XMLHttpRequest();
    request.open("POST", "/");
    request.send(formData);

    request.addEventListener("load", function(){
        const data = JSON.parse(this.responseText)
        
        const { task_element } = createElement(data)
        element.append(task_element)
    })
    document.getElementById("task").value = ""
    document.getElementById("picture").value = ""
}

/*<div class="task">
    <input type="text"
        value="task 1"
        disabled>
    <img src="../uploads/test.jpg" width="90" height="50">   
    <div class = "action">
        <input type="checkbox">
        <button class="material-icons">edit</button>
        <button class="material-icons remove-btn">highlight_off</button>
    </div>
</div>*/

function createElement(item){
    const task_element = document.createElement("div")
    task_element.classList.add("task")

    const input_task = document.createElement("input")
    input_task.type = "text"
    input_task.setAttribute("disabled", "")
    input_task.value = item.text

    const image_element = document.createElement("img")
    image_element.setAttribute("width","90")
    image_element.setAttribute("height","50")
    image_element.src = item.image

    const action = document.createElement("div")
    action.classList.add("action")

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = item.complete

    if(item.complete){
        checkbox.checked = true
        task_element.classList.add("compelete")
    }else{
        task_element.classList.remove("compelete")
    } 

    const edit_button = document.createElement("button")
    edit_button.classList.add("material-icons")
    edit_button.innerText = "edit"

    const remove_button = document.createElement("button")
    remove_button.classList.add("material-icons","remove-btn")
    remove_button.innerText = "highlight_off"

    action.append(checkbox)
    action.append(edit_button)
    action.append(remove_button)

    task_element.append(input_task)
    task_element.append(image_element)
    task_element.append(action)

    //Events

    checkbox.addEventListener("change",() =>{
        item.complete = checkbox.checked    // will return true or false
        
        saveEdit(item, function(){
            
            if(item.complete){
            task_element.classList.add("compelete")
            }else{
            task_element.classList.remove("compelete")
            }
        })
    })
    //for new text
    input_task.addEventListener("input", () =>{
        item.text = input_task.value
    })
    //when click outside box
    input_task.addEventListener("blur", () =>{

        saveChange(item, function(){
            input_task.setAttribute("disabled","")
        })
        
    })
    //clicked edit button
    edit_button.addEventListener("click", () =>{
        input_task.removeAttribute("disabled")
        input_task.focus()
    })
    //clicked remove button
    remove_button.addEventListener("click", () => {
       
        removeTodo(item, function(){
            task_element.remove()
        })                                   
    })

    return { task_element }
}

// function saveTodo(item, callback){
//     var request = new XMLHttpRequest()

//     request.open("post","/saveData")
//     request.setRequestHeader("Content-Type","application/json")
//     request.send(JSON.stringify(item))

//     request.addEventListener("load",function(){
//         request.status === 200 && callback()
//     })
// }

loadTodos(function(todos){
        todos.forEach(ele => {
            const { task_element } = createElement(ele)
            element.append(task_element)
    })
})

function loadTodos(callback){

    var request = new XMLHttpRequest()

    request.open("get", "/loadData")
    request.send()
    request.addEventListener("load", function(){
        
        callback(JSON.parse(request.responseText))
    })
}

function saveEdit(item, callback){

    var request = new XMLHttpRequest()

    request.open("post", "/editData")
    request.setRequestHeader("Content-Type","application/json")
    request.send(JSON.stringify(item))

    request.addEventListener("load", function(){
        request.status === 200 && callback()
    })
}

function saveChange(item, callback){
    var request = new XMLHttpRequest()

    request.open("post", "/saveChange")
    request.setRequestHeader("Content-Type","application/json")
    request.send(JSON.stringify(item))

    request.addEventListener("load", function(){
        request.status === 200 && callback()
    })
}

function removeTodo(item, callback){
    var request = new XMLHttpRequest()

    request.open("post", "/delTodo")
    request.setRequestHeader("Content-Type","application/json")
    request.send(JSON.stringify(item))

    request.addEventListener("load", function(){
        request.status === 200 && callback()
    })
}