"use strict";

//— Добавить к каждому todo item который создается при сабмите формы поле completed
//— поле completed должно содержать false когда пользователь только что создал todo item
//— Поле completed можно изменить прямо из элемента todo http://joxi.ru/GrqX0JLf4v1Y5A — нужно добавить в него checkbox
//— Если задача не выполнена — нежно чтобы в чекбоксе не было галочки, а если выполнена — чтобы была (сразу после создания todo item галочки нету)
//— Если пользователь нажимает на текущем элементе на галочку то нужно изменять статус текущей задачи на выполненный (completed: true)
//— Так как все todo items у нас хранятся в массиве внутри localStorage то с ним нам и нужно работать
//— Добавить возможность удалять каждый отдельный todo item
//— Добавить возможность удалять сразу все todo items

class TodoModel{
  constructor() {
    this.dbName = "saved_data";
    // this.num = 0;
  }
  _num = 0;
  get num() {
    return this._num;
  }
    set num(numberValue) {
        this._num = numberValue;
    }
  saveData(todoItem) {
    if (localStorage[this.dbName]) {
      const data = JSON.parse(localStorage[this.dbName]);
      data.push(todoItem);
      localStorage.setItem(this.dbName, JSON.stringify(data));
      return data;
    }
    const data = [todoItem];
    localStorage.setItem(this.dbName, JSON.stringify(data));
    return data;
  }
  getDataModel() {
    if (!localStorage.getItem(this.dbName)) return false;
    return localStorage.getItem(this.dbName);
  }
  reSetData(arr) {
    localStorage.clear();
    localStorage.setItem(this.dbName, JSON.stringify(arr));
  }
  removeData() {
    localStorage.clear();
  }
};


class TodoController extends TodoModel{
  constructor() {
    super();
  
  }
  getData() {
    if (!setEvent.getDataModel()) return false;
    return JSON.parse(setEvent.getDataModel());
  }
  setData(inputs) {
    const todoItemObject = setEvent.handleInputs(inputs);
    setEvent.saveData(todoItemObject);
    return todoItemObject;
  }
  handleInputs(inputs) {
    const obj = {};
    for (const input of inputs) {
      obj[input.name] = input.value;
    }
    obj.checkbox = false;
    obj.completed = "false";
    return obj;
  }
  makeCheckBox(boxCheck) {
    let index = Number(boxCheck.target.parentElement.id);
    const arr = setEvent.getData();
    arr[index].completed = "true";
    arr[index].checkbox = !arr[index].checkbox;
    setEvent.reSetData(arr);
    return arr;
  }
  deletElem(elemDel) {
    let index = Number(elemDel.target.parentElement.id);
    const arr = setEvent.getData();
    arr.splice(index, 1);
    setEvent.reSetData(arr)
    return arr;
  }
  deletAllElem(delAll) {
     setEvent.num=0;
    const arr = setEvent.getData();
    setEvent.removeData();
    return arr;
  }
};
class TodoView extends TodoController{
  constructor() {
    super();
    this.form = document.querySelector("#todoForm");
    this.template = document.querySelector("#todoItems");
    this.removeAll = document.querySelector("#todoForm");
  }
  setEvents() {
    window.addEventListener("load", setEvent.onLoadFunc);
    this.form.addEventListener("submit", setEvent.formSubmit);
    this.template.addEventListener("change", setEvent.checkBoxFunc);
    this.template.addEventListener("click", setEvent.deletElemFunc);
    this.removeAll.addEventListener("click", setEvent.deletAllFunc);
  }
  formSubmit(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll("input, textarea");

    for (const input of inputs) {
      if (!input.value.length) return alert("No way you can add this shit");
    }
    setEvent.setData(inputs);
    const todoItemObject =
    setEvent.getData()[setEvent.getData().length - 1];
    setEvent.renderItem(todoItemObject);
    e.target.reset();
  }
  onLoadFunc() {
    if (!localStorage.getItem("saved_data")) return false;
    setEvent.num=0;
    setEvent.getData().forEach((item) => setEvent.renderItem(item));
  }
  checkBoxFunc(boxCheck) {
    setEvent.makeCheckBox(boxCheck);
    console.log(setEvent.template);
    setEvent.template.textContent = "";
    setEvent.onLoadFunc();
  }
  deletElemFunc(elemDel) {
    if (elemDel.target.className === 'taskButton') {
      setEvent.deletElem(elemDel);
      setEvent.template.innerHTML = '';
      setEvent.onLoadFunc();
    }
  }
  deletAllFunc(delAll) {
    console.log(delAll.target);
    if (delAll.target.className === 'del') {
      setEvent.deletAllElem(delAll);
      setEvent.template.innerHTML = '';

    }
  }
  createTemplate(
    titleText = "",
    descriptionText = "",
    completedText = "",
    checkboxTick = false,
    buttonText = "Delete element",
  ) {
    const mainWrp = document.createElement("div");

    mainWrp.className = "col-4";

    const wrp = document.createElement("div");
    wrp.className = "taskWrapper";
    console.log(setEvent.num)
    wrp.id = setEvent.num++;
    mainWrp.append(wrp);

    const title = document.createElement("div");
    title.innerHTML = titleText;
    title.className = "taskHeading";
    wrp.append(title);

    const description = document.createElement("div");
    description.innerHTML = descriptionText;
    description.className = "taskDescription";
    wrp.append(description);

    const completed = document.createElement("div");
    completed.innerHTML = completedText;
    completed.className = "taskCompleted";
    wrp.append(completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checkboxTick;
    checkbox.className = "taskCheckbox";
    wrp.append(checkbox);

    const button = document.createElement("button");
    button.innerHTML = buttonText;
    button.className = "taskButton";
    wrp.append(button);

    return mainWrp;
  }
  renderItem({ title, description, completed, checkbox }) {
    const template = setEvent.createTemplate(
      title,
      description,
      completed,
      checkbox
    );
    document.querySelector("#todoItems").prepend(template);
  }
  creatDeleteAllButt(deleteAllText = 'Delete All') {
    const deleteAll = document.createElement("button");
    const dellBut = document.querySelector("#todoForm");
    const spanOuter = document.createElement("span");
    const spanInner = document.createElement("span");
    deleteAll.append(spanOuter);
    spanOuter.append(spanInner);
    spanOuter.className = "buttonDel__text";
    spanInner.innerHTML = deleteAllText;
    spanInner.className = "del";
    deleteAll.className = "buttonDel";
    deleteAll.setAttribute('type', 'button');
    dellBut.append(deleteAll);
    console.log(deleteAll);
    
  }
};


let setEvent = new TodoView();
console.log(setEvent);
setEvent.setEvents();
setEvent.creatDeleteAllButt()
