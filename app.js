document.addEventListener("DOMContentLoaded", () => {
    const toDoForm = document.getElementById("todo-form");
    const titleInput = document.getElementById("todo-title");
    const detailsInput = document.getElementById("todo-details");
    const dueDateInput = document.getElementById("todo-due-date");
    const toDoList = document.getElementById("todo-list");

    const TODOS_KEY = "todos";
    let toDos = [];
    let editingToDoId = null;

    function saveToDos() {
        localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
    }

    function deleteToDo(event) {
        const li = event.target.parentElement;
        toDos = toDos.filter((toDo) => toDo.id !== li.id);
        li.remove();
        saveToDos();
    }

    function startEditingToDo(event) {
        const li = event.target.parentElement;
        const todoId = li.id;
        const todoToEdit = toDos.find(todo => todo.id === todoId);

        
        titleInput.value = todoToEdit.title;
        detailsInput.value = todoToEdit.details;
        dueDateInput.value = todoToEdit.dueDate;

        
        editingToDoId = todoId;

        
        toDos = toDos.filter(todo => todo.id !== todoId);
        li.remove();
        saveToDos();
    }

    function paintToDo(newTodo) {
        const li = document.createElement("li");
        li.id = newTodo.id;
        const titleSpan = document.createElement("span");
        titleSpan.innerText = `제목: ${newTodo.title}`;
        const detailsSpan = document.createElement("span");
        detailsSpan.innerText = `\n세부사항: ${newTodo.details}`;
        const dueDateSpan = document.createElement("span");
        dueDateSpan.innerText = `\n마감일: ${newTodo.dueDate}`;
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "delete";
        deleteButton.addEventListener("click", deleteToDo);
        const editButton = document.createElement("button");
        editButton.innerText = "edit";
        editButton.addEventListener("click", startEditingToDo);

        li.appendChild(titleSpan);
        li.appendChild(detailsSpan);
        li.appendChild(dueDateSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        toDoList.appendChild(li);
    }

    function handleToDoSubmit(event) {
        event.preventDefault();

        
        if (editingToDoId) {
            
            const updatedTodo = {
                title: titleInput.value,
                details: detailsInput.value,
                dueDate: dueDateInput.value,
                id: Date.now().toString() 
            };
            toDos.push(updatedTodo);
            editingToDoId = null; 
        } else {
            
            const newTodo = {
                title: titleInput.value,
                details: detailsInput.value,
                dueDate: dueDateInput.value,
                id: Date.now().toString()
            };
            toDos.push(newTodo);
        }

        
        titleInput.value = "";
        detailsInput.value = "";
        dueDateInput.value = "";

        toDoList.innerHTML = "";
        toDos.forEach(paintToDo);

        saveToDos();
    }

    toDoForm.addEventListener("submit", handleToDoSubmit);

    const savedToDos = localStorage.getItem(TODOS_KEY);

    if (savedToDos !== null) {
        const parsedToDos = JSON.parse(savedToDos);
        toDos = parsedToDos;
        parsedToDos.forEach(paintToDo);
    }
});
