const toDoForm = document.querySelector(".todo-form");
const toDoList = document.querySelector(".todo-list");
const toggleToDoForm = document.querySelector(".toggle-form");

const TODO_KEY = "toDos";

let toDos = [];

//local storage에 ToDos 저장
function registerToDo() {
  toDos.sort((a, b) => {
    return a.done - b.done;
  });
  localStorage.setItem(TODO_KEY, JSON.stringify(toDos));
  location.reload();
}

//Done Task 설정
function doneTask(event) {
  const form = event.target.parentElement;
  form.classList.toggle("done");
  toDos.map((todo) => {
    if (todo.id == form.id) {
      todo.done = !todo.done;
    }
  });
  registerToDo();
}

//SaveBtn 과 EditBtn hidden 바꾸기
function toggleBtn(target) {
  const actions = target.querySelector(".actions");
  const saveBtn = actions.querySelector(".save_button");
  const editBtn = actions.querySelector(".edit_button");

  saveBtn.hidden = !saveBtn.hidden;
  editBtn.hidden = !editBtn.hidden;
}

//ToDo 세부사항 수정
function editToDo(event) {
  event.preventDefault();
  const curItem = event.target.parentElement.parentElement.parentElement;
  const dueDate = curItem.querySelector(".duedate");
  dueDate.removeAttribute("disabled");
  dueDate.type = "date";
  const content = curItem.querySelector(".content");
  content.removeAttribute("disabled");

  toggleBtn(curItem);

  curItem.addEventListener("submit", handleEditSubmit);
}

//ToDo 하나 삭제하기
function removeToDo(event) {
  const curItem = event.target.parentElement.parentElement.parentElement;
  curItem.remove();
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(curItem.id));
  registerToDo();
}

//수정사항 저장하기
function handleEditSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const doneTask = form.querySelector(".done_task");
  const content = form.querySelector(".content");
  const dueDate = form.querySelector(".duedate");
  const editedTodo = {
    done: doneTask.value,
    date: dueDate.value,
    content: content.value,
    id: form.id,
  };
  toDos = toDos.map((toDo) =>
    toDo.id == parseInt(editedTodo.id)
      ? { ...toDo, date: editedTodo.date, content: editedTodo.content }
      : toDo
  );
  registerToDo();
  content.setAttribute("disabled", true);
  dueDate.type = "text";
  dueDate.setAttribute("disabled", true);
  toggleBtn(form);
}

//새로운 ToDo 저장하기
function handleToDoSubmit(event) {
  const form = event.target;
  const content = form.querySelector(".content");
  const dueDate = form.querySelector(".duedate");
  const newToDoObject = {
    done: false,
    date: dueDate.value,
    content: content.value,
    id: Date.now(),
  };
  toDos.push(newToDoObject);
  content.value = "";
  dueDate.value = "";
  registerToDo();
  toDoList.appendChild(paintToDo(newToDoObject));
}

//ToDo form 새로 생성하기
function paintToDo(newToDo) {
  const form = document.createElement("form");
  form.id = newToDo.id;
  form.className = "todo";

  const checkBox = document.createElement("input");
  checkBox.className = "done_task";
  checkBox.type = "checkbox";
  console.log(newToDo.done);
  if (newToDo.done) {
    checkBox.checked = true;
    form.classList.toggle("done");
  }

  const dueDate = document.createElement("input");
  dueDate.className = "duedate";
  dueDate.type = "date";
  dueDate.value = newToDo.date;
  dueDate.setAttribute("disabled", true);

  const content = document.createElement("input");
  content.className = "content";
  dueDate.type = "text";
  content.value = newToDo.content;
  content.setAttribute("disabled", true);

  const actions = document.createElement("div");
  actions.className = "actions";

  const saveBtn = document.createElement("button");
  const saveSpan = document.createElement("span");
  saveBtn.className = "save_button";
  saveSpan.innerText = "save";
  saveBtn.appendChild(saveSpan);
  saveBtn.setAttribute("hidden", true);

  const editBtn = document.createElement("button");
  const editSpan = document.createElement("span");
  editBtn.className = "edit_button";
  editSpan.innerText = "edit";
  editBtn.appendChild(editSpan);

  const deleteBtn = document.createElement("button");
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "delete";
  deleteBtn.appendChild(deleteSpan);

  checkBox.addEventListener("click", doneTask);
  editBtn.addEventListener("click", editToDo);
  deleteBtn.addEventListener("click", removeToDo);

  actions.appendChild(saveBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  form.appendChild(checkBox);
  form.appendChild(dueDate);
  form.appendChild(content);
  form.appendChild(actions);
  return form;
}

//new Todo 입력 Form 숨기고 나타내기
toggleToDoForm.addEventListener("click", () => {
  toDoForm.classList.toggle("hide");
});

toDoForm.addEventListener("submit", handleToDoSubmit);

//새로고침시 local storage에서 풀러와서 화면에 출력하기

function printToDoList() {
  const savedToDos = localStorage.getItem(TODO_KEY);

  if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach((prevToDo) =>
      toDoList.appendChild(paintToDo(prevToDo))
    );
  }
}

printToDoList();
