class ToDoUtility {
    getToDoElement(id){
         return document.getElementById(id);
    }

    doneToDo(id, status, className){
        let toDoId = this.getToDoElement(id);
        toDoId.setAttribute('class', className);
        toDoId.setAttribute('data-status', status);
    }

    unDoneToDo(id, status, className){
        let toDoId =  this.getToDoElement(id);
        toDoId.setAttribute('class', className);
        toDoId.setAttribute('data-status', status);
    }
    doToDo(id, status, className){
        let toDoId =  this.getToDoElement(id);
        toDoId.setAttribute('class', className);
        toDoId.setAttribute('data-status', status);
    }

    removeToDo(id){
        let toDoId = this.getToDoElement(id);
        toDoId.remove();
    }
}
