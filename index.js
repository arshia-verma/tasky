
//parent element to store cards
const taskContainer = document.querySelector(".task_container");
const taskModal= document.querySelector(".task_modal_body");

//global store
let globalStore = [];

const newCard = ({ id, imageUrl, taskTitle, taskType, taskDescription }) => `<div class="col-md-6 col-lg-4 " id=${id}>
<div class="card">
    <div class="card-header d-flex justify-content-end gap-3 ">
        <button type="button " class="btn btn-outline-success " id=${id} onclick="editCard.apply(this,arguments)"><i class="fas fa-pencil-alt " id=${id} onclick="editCard.apply(this,arguments)"></i></button>
        <button type="button " class="btn btn-outline-danger " id=${id} onclick="deleteCard.apply(this,arguments)"><i class="fas fa-trash-alt " id=${id} onclick="deleteCard.apply(this,arguments)"></i></button>
    </div>
    <img src=${imageUrl} class="card-img-top " alt="Image ">
    <div class="card-body ">
        <h5 class="card-title ">${taskTitle}</h5>
        <p class="card-text ">${taskDescription}</p>
        <span class="badge bg-primary ">${taskType}</span>
    </div>
    <div class="card-footer text-muted ">
        <button type="button " id=${id} onclick="openTask.apply(this,arguments)" class="btn btn-outline-primary float-end " data-bs-toggle="modal" data-bs-target="#exampleModal2">Open Task</button>
    </div>
</div>
</div>`;



const htmlModalContent = ({ id, imageUrl, taskTitle, taskType, taskDescription }) => {
    const date = new Date(parseInt(id));
    return ` <div id=${id}>
    <img src=${imageUrl} class="card-img-top " alt="Image ">
    
    <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
    <h2 class="my-3">${taskTitle}</h2>
    <p class="lead">
    ${taskDescription}
    </p>
    <span class="badge bg-primary ">${taskType}</span>
    </div>`;
  };

  const openTask = (event) => {
      if(!event)
      event=window.event;

      const getTask = globalStore.filter(({id}) => id === event.target.id);  
      taskModal.innerHTML = htmlModalContent(getTask[0]);

  };
  

const loadInitialTaskCards = () => {
    //access local storage
    const getInitialData = localStorage.tasky;
    if (!getInitialData) return;

    //convert stringified-object to object
    const { cards } = JSON.parse(getInitialData);

    //map around the array to generate HTML card and inject it to DOM
    cards.map((cardObject) => {
        const createNewCard = newCard(cardObject);
        taskContainer.insertAdjacentHTML("beforeend", createNewCard);
        globalStore.push(cardObject);
    });

};
const updateLocalStorage=()=> 
    localStorage.setItem("tasky",JSON.stringify({cards:globalStore}));


const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`,
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };

    const createNewCard = newCard(taskData);

    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    globalStore.push(taskData);

    //add to local storage
    updateLocalStorage();
    //cant directly send array as argument so sent object

};

const deleteCard=(event)=>{
//id
event=window.event;
const targetID=event.target.id;
const tagname= event.target.tagName;

//search the global store , remove the object which matches with the id
globalStore=globalStore.filter((cardObject)=>cardObject.id !== targetID);

updateLocalStorage();

if(tagname === "BUTTON"){
    return taskContainer.removeChild(
        event.target.parentNode.parentNode.parentNode
    );
}
return taskContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode
);
}
 
const editCard = (event)=>{
    event=window.event;
    const targetID=event.target.id;
    const tagname= event.target.tagName;

    let parentElement;

    if(tagname === "BUTTON"){
        parentElement=event.target.parentNode.parentNode;

    }
    else{
        parentElement=event.target.parentNode.parentNode.parentNode;
    }

    

    let taskTitle=parentElement.childNodes[5].childNodes[1];
    let taskDescription=parentElement.childNodes[5].childNodes[3];
    let taskType=parentElement.childNodes[5].childNodes[5];
    let submitButton=parentElement.childNodes[7].childNodes[1];

    
    
    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true"); 
    taskType.setAttribute("contenteditable","true");
    submitButton.setAttribute("onclick","saveEditChanges.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML="Save Changes";
};
const saveEditChanges = (event)=>{
    event=window.event;
    const targetID=event.target.id;
    const tagname= event.target.tagName;

    let parentElement;

    if(tagname === "BUTTON"){
        parentElement=event.target.parentNode.parentNode;

    }
    else{
        parentElement=event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle=parentElement.childNodes[5].childNodes[1];
    let taskDescription=parentElement.childNodes[5].childNodes[3];
    let taskType=parentElement.childNodes[5].childNodes[5];
    let submitButton=parentElement.childNodes[7].childNodes[1];

    const updatedData={
        taskTitle: taskTitle.innerHTML,
        taskType: taskType.innerHTML,
        taskDescription: taskDescription.innerHTML,
    };

    

    globalStore=globalStore.map((task)=>{
        if(task.id === targetID){
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }
        return task; 
    });
    updateLocalStorage();

    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false"); 
    taskType.setAttribute("contenteditable","false");
    submitButton.removeAttribute("onclick");
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#exampleModal2");
    submitButton.innerHTML="Open Task";
};
