/*let burger = document.body.querySelector('.burger');*/
let menu = document.getElementById('menu_button_block');
let index =1;
let localStorageName = 'toDoList';
let toDoList = [];
let toDoEvent = [];
let toDoUtility = new ToDoUtility();
let classDone = 'alert alert-success';
let classDo = 'alert alert-secondary';
let classUnDone = 'alert alert-danger';
let classHoliday = 'alert holiday';
let statusDone = 'done';
let statusDo = 'do';
let statusUnDone = 'undone';
let textStatusDone = 'Виконано';
let textStatusUnDone = 'Не виконано';
let textStatusDo = 'В дії'
let textRemove = 'Видалити';
let basicWrapper = document.body.querySelector('.basic_wrapper');
let toDoItemWrapper = document.getElementById('to-do-item_wrapper');
let toDolistWrapper = document.getElementById('list_block');
let toDoWrapper = document.body.querySelector('.wrapper-to-do');
let birthdayWrapper = document.body.querySelector('.wrapper-birthday');
let createToDoItemButton = document.getElementById('create-to-do-item');
let birthdayButton =document.getElementById('birthday_button');
let сloseToDoItemButton = document.getElementById('close-to-do-item');
let title = document.getElementById('title-to-do-list');
let description = document.getElementById('description-to-do-list');
let minuteInput = document.getElementById('minute-to-do-list');
let hourInput = document.getElementById('hour-to-do-list');
let timeButton = document.getElementById('time_button');
let birthdayBlock = document.getElementById('birthday_block');
let listBlock = document.getElementById('list_block');
let listWrapper = document.body.querySelector('.list_wrapper');
let deadlineMessage = document.getElementById("deadline-message");
let oneDay = 86400000;
let holiday = {
    'NewYear' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'НОВИЙ РІК','description': null, 'time': null},
    'Christmas' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'РІЗДВО ХРИСТОВЕ','description': null, 'time': null},
    'WomensDay' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'МІЖНАРОДНИЙ ЖІНОЧИЙ ДЕНЬ','description': null, 'time': null},
    'Easter' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'ВЕЛИКДЕНЬ','description': null, 'time': null},
    'LaborDay' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'ДЕНЬ ПРАЦІ','description': null, 'time': null},
    'VictoryDay' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'ДЕНЬ ПЕРЕМОГИ','description': null, 'time': null},
    'HolyTrinity' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'ДЕНЬ СВЯТОЇ ТРІЙЦІ','description': null, 'time': null},
    'ConstitutionDay' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'ДЕНЬ КОНСТИТУЦІЇ УКРАЇНИ','description': null, 'time': null},
    'IndependenceDay' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'ДЕНЬ НЕЗАЛЕЖНОСТІ УКРАЇНИ','description': null, 'time': null},
    'MensDay' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'ДЕНЬ ЗАХИСНИКА УКРАЇНИ','description': null, 'time': null},
    'СatholicСhristmas' : {'id': index, 'type': 'holiday', 'status': statusDo, 'title': 'КАТОЛИЦЬКЕ РІЗДВО ХРИСТОВЕ','description': null, 'time': null},
};

let selectedDate = {
    'day': null,
    'month': null,
    'year': null
};


let fullList = {
    ['1,1'] : [holiday.NewYear],
    ['7,1'] : [holiday.Christmas],
    ['8,3'] : [holiday.WomensDay],
    ['1,5'] : [holiday.LaborDay],
    ['9,5'] : [holiday.VictoryDay],
    ['7,6'] : [holiday.HolyTrinity],
    ['28,6'] : [holiday.ConstitutionDay],
    ['24,8'] : [holiday.IndependenceDay],
    ['14,10'] : [holiday.MensDay],
    ['25,12'] : [holiday.СatholicСhristmas],
};
let fullListJson = JSON.stringify(fullList);

let keyFullList = null;
let body =document.body;


if(!localStorage.getItem(localStorageName)){
    localStorage.setItem(localStorageName, fullListJson);
} else {
    //localStorage.clear();
    fullListJson = localStorage.getItem(localStorageName);
    fullList = JSON.parse(fullListJson);
};


// ініціалізація дати, відбір та запис необхідних звміток
function initToDoListForDate(day, month, year){
    let easterDate = makeEaste(year).getDate();
    let easterMonth = parseInt(makeEaste(year).getMonth())+1;
    let easterYear = makeEaste(year).getFullYear();


    if(!fullList[easterDate + "," +easterMonth+","+easterYear]) {
        fullList[easterDate + "," +easterMonth+","+easterYear] = [holiday.Easter];
        console.log(fullList);
    }

    toDoList = (fullList[day+","+month+","+year]) ? fullList[day+","+month+","+year] : (!fullList[easterDate + "," +easterMonth+","+year]) ? fullList[easterDate + "," +easterMonth+","+easterYear] : [];
    toDoEvent = (fullList[day+","+month]) ? fullList[day+","+month]  : [];
    console.log( toDoList, 887799);

    index = toDoList.length + toDoEvent.length;

    selectedDate = {
        'day': day,
        'month': month,
        'year': year
    }

    toDoWrapper.innerHTML = '';
    birthdayWrapper.innerHTML = '';


    if(toDoList.length >= 1){
        toDoList.forEach(function (item, index) {
            createToDo(toDoList[index]);
        })
    }

    if(toDoEvent.length >= 1){
        toDoEvent.forEach(function (item, index) {
            createToDo(toDoEvent[index]);
        })
    }
}

// створення ключа з вибраною затою та запис створених заміток, їх змін
function updateToDoList(){
     let toDoItemWrapperBirthday =document.body.querySelector('.birthday')


    if (toDoItemWrapperBirthday) {
        fullList[selectedDate.day + "," + selectedDate.month] = toDoEvent;
    } else {
        fullList[selectedDate.day + "," + selectedDate.month + "," + selectedDate.year] = toDoList;
    }

    fullListJson = JSON.stringify(fullList);
    localStorage.setItem(localStorageName, fullListJson);

}

// розрахунок Великодня
function makeEaste(year) {
    let p = null;
    let a = (19*(year%19) + 15) % 30;
    let b = ((2*(year%4) + 4*(year%7) + 6*a + 6) % 7);
    if(a + b > 10) {
        p = new Date(year, 3, a + b - 9, 0, 0, 0, 0);
    } else {
        p = new Date(year, 2, 22 + a + b, 0, 0, 0, 0);
    }
    p.setDate(p.getDate()+13);
    return p;
}

//натискання на дату
function clickDate(day, month, year) {
    let tdSel = document.body.querySelector('.selected');
    let holidayList = toDoList.find(element => element.type == 'holiday');
    menu.classList.add('open');
    basicWrapper.classList.add('open_menu');
    toDoItemWrapper.classList.remove('open');
    if((((toDoList.length <= 0) || (toDoList.length <= 1 && holidayList) || birthdayBlock.classList.contains('open'))
        && ((toDoEvent.length <= 0 && !holidayList) || listBlock.classList.contains('open')))
        || (!birthdayBlock.classList.contains('open') && !listBlock.classList.contains('open'))) {
        listWrapper.classList.remove('open');
        document.getElementById('add_list_button').classList.remove("active_button");
        document.getElementById('see_list_button').classList.remove("active_button");
        document.getElementById('see_birthday_button').classList.remove("active_button");
    }
    else if(toDoEvent.length <= 0 && !holidayList  ) {
        birthdayBlock.classList.remove('open');
    }
    else if ((toDoList.length <= 0) || (toDoList.length <= 1 && holidayList)) {
        listBlock.classList.remove('open');
    }


    //повторне натискання на вибрану дату
    if (tdSel) {
        tdSel.onclick = function () {
            if (toDoItemWrapper.classList.contains("open")) {
                toDoItemWrapper;
            } else if (listBlock.classList.contains("open")) {
                listBlock;
            } else if (birthdayBlock.classList.contains("open")) {
                birthdayBlock;
            }
        }
    }

    // запис заголовка з дотою в вікні створення замітки
    let dateTittle = document.body.querySelector('.date_tittle');
    dateTittle.innerText = ''+ day+'.'+month+'.'+year+'';


    //приховати кнопку таймера
    let deadline = new Date(year, (month - 1), day, 24, 60, 60, 1000 );
    let t = Date.parse(deadline) - Date.parse(new Date());
    console.log(t);
    if (t<=0) {
        timeButton.classList.add('hidden');
    } else {
        timeButton.classList.remove('hidden')
    }
};

//вибір меню перегляду
function buttonMenu(name) {
    let nameBlock = ''+name+'';
    let blockOpen = document.getElementById(nameBlock);

    if (blockOpen == toDoItemWrapper) {
        blockOpen.classList.add('open');
        listWrapper.classList.add('open');
        listBlock.classList.remove('open');
        birthdayBlock.classList.remove('open');
        document.getElementById('add_list_button').classList.add("active_button");
        document.getElementById('see_list_button').classList.remove("active_button");
        document.getElementById('see_birthday_button').classList.remove("active_button");
        document.getElementById('see_calendar_button').classList.remove("active_button");
    }
    else if (blockOpen == listBlock && toDoWrapper.children.length > 0) {
        blockOpen.classList.add('open');
        listWrapper.classList.add('open');
        toDoItemWrapper.classList.remove('open');
        birthdayBlock.classList.remove('open');
        document.getElementById('see_list_button').classList.add("active_button");
        document.getElementById('add_list_button').classList.remove("active_button");
        document.getElementById('see_birthday_button').classList.remove("active_button");
        document.getElementById('see_calendar_button').classList.remove("active_button");
    }
    else if (blockOpen == birthdayBlock && birthdayWrapper.children.length > 0) {
        blockOpen.classList.add('open');
        listWrapper.classList.add('open');
        toDoItemWrapper.classList.remove('open');
        listBlock.classList.remove('open');
        document.getElementById('see_birthday_button').classList.add("active_button");
        document.getElementById('add_list_button').classList.remove("active_button");
        document.getElementById('see_list_button').classList.remove("active_button");
        document.getElementById('see_calendar_button').classList.remove("active_button");
    }
    else if (blockOpen == calendarBlock) {
        blockOpen.classList.add('open')
        toDoItemWrapper.classList.remove('open');
        listBlock.classList.remove('open');
        birthdayBlock.classList.remove('open');
        listWrapper.classList.remove('open');
        document.getElementById('see_calendar_button').classList.add("active_button");
        document.getElementById('add_list_button').classList.remove("active_button");
        document.getElementById('see_list_button').classList.remove("active_button");
        document.getElementById('see_birthday_button').classList.remove("active_button");
    }

    if (listWrapper.classList.contains('open')) {
        calendarBlock.classList.add('open_wrapper_list')
    } else {
        calendarBlock.classList.remove('open_wrapper_list')
    }

};

//добавити позначку
function upMark() {
    for (let keyFullList in fullList) {
        if (fullList[keyFullList].length >= 1) {
            let tdlist = document.body.querySelector('td[data-attribute="' + keyFullList + '"]');
            let tdEvent = document.body.querySelector('td[data-event="' + keyFullList + '"]');
            let holidayList = fullList[keyFullList].find(element => element.type == 'holiday');
            let birthdayList = fullList[keyFullList].find(element => element.type == 'birthday');
            let List = fullList[keyFullList].find(element => element.type == 'list');
            let timerList = fullList[keyFullList].find(element => element.time);
            if (tdlist && List) {
                    tdlist.classList.add('not_empty_list');
                if (timerList) {
                    let deadline = Date.parse(timerList.time);
                    if (deadline > Date.parse(new Date())) {
                        tdlist.classList.add('list_timer');
                        let total = deadline - Date.parse(new Date());
                        if (total < oneDay) {
                            tdlist.classList.add('twinkle');
                        }
                    }
                }
            }
            if (tdEvent && birthdayList) {
                tdEvent.classList.add('not_empty_birthday');
            }
        }
    }
};

//Зміна статуса заміток та приховання таймера
function buttonStatus(id, status, type, deadline) {
    let indexId = +id;
    let itemStatus = status;
    let deadlineMessage = document.getElementById("deadline-message");
    let buttonDo = document.body.querySelector('.button-do');

    if(itemStatus === statusDone){
        toDoUtility.doneToDo('to-do-'+ indexId, statusDone, classDone);
        buttonDo.classList.remove('hidden');
        if (deadline != null) {
            document.getElementById('countdown').className = "hidden";
        }
    } else if(itemStatus === statusUnDone){
        toDoUtility.unDoneToDo('to-do-'+ indexId, statusUnDone, classUnDone);
        buttonDo.classList.remove('hidden');
        if (deadline != null) {
            document.getElementById('countdown').className = "hidden";
        }
    } else if(itemStatus === statusDo){
        toDoUtility.doToDo('to-do-'+ indexId, statusDo, classDo);
        buttonDo.classList.add('hidden');
        if (deadline != null && !deadlineMessage.classList.contains('visible')) {
            document.getElementById('countdown').className = "countdown";
        }
    }

    toDoList.forEach(function(item, index) {
        if(toDoList[index].id === indexId && type == 'list'){
            toDoList[index].status = itemStatus;
        }
    });

    updateToDoList();

    return null;
}

//Видалення заміток
function buttonRemove(id) {
    let holidayList = toDoList.find(element => element.type == 'holiday');
    let indexId = +id;
    let itemId = 'to-do-' + indexId;

    toDoUtility.removeToDo(itemId);

    toDoList.forEach(function(item, index) {
        if(toDoList[index].id === indexId){
            toDoList.splice(index,1);
        }
    });
    toDoEvent.forEach(function(item, index) {
        if(toDoEvent[index].id === indexId){
            toDoEvent.splice(index,1);
            console.log(holidayList);
        }
    });

    if((toDoList.length <= 0 || (toDoList.length <= 1 && holidayList)) && listBlock.classList.contains('open')) {
        toDoWrapper.innerHTML = '<div id="list_empty_message" class="empty_message"> Замітки відсутні </div>';
        /*listWrapper.classList.remove('open');
        listBlock.classList.remove('open');*/
    }
    else if ((toDoEvent.length <= 0 && !holidayList) || (toDoEvent.length <= 0 && toDoList.length <= 0)) {
        birthdayWrapper.innerHTML = '<div id="event_empty_message" class="empty_message"> Події відсутні </div>';
        /*listWrapper.classList.remove('open');
        birthdayBlock.classList.remove('open');*/
    }

    updateToDoList();

    return null;

}

//Створення заміток
function createToDo(toDo) {
    let id = toDo.id;
    let status = toDo.status;
    let type = toDo.type;
    let statusClassActive = (status === statusDone) ? classDone : (status === statusUnDone) ? classUnDone :(type === 'holiday') ? classHoliday : classDo;
    let title = toDo.title;
    let description = toDo.description;
    let toDoItem = document.createElement('div');
    let deadline = toDo.time;
    let listMessage = document.getElementById('list_empty_message');
    let eventMessage = document.getElementById('event_empty_message')

    toDoItem.setAttribute('class', 'col-md-12');

    let toDoItemHtml = '<div id="to-do-'+ id +'" data-status="'+ status +'" class="'+ statusClassActive +'">';
    toDoItemHtml += '<h4 class="display-6">'+ selectedDate.day+'.'+selectedDate.month+'.'+selectedDate.year+'</h4>';
    toDoItemHtml += '<h2 class="display-6">'+ title + '</h2>';
    toDoItemHtml += '<hr class="my-4">';
    if (type == 'list') {
        toDoItemHtml += '<p>'+ description + '</p>';
        toDoItemHtml += '<hr class="my-4">';
        //таймер
        if (deadline != null) {
            toDoItemHtml += '<div id="deadline-message" class="deadline-message"> Час минув! </div>';
            toDoItemHtml += '<div id="countdown" class="countdown">';
            toDoItemHtml += '<h2 class="countdown-tittle">Залишилось :</h2>';
            toDoItemHtml += '<div class="countdown-number-wrapper">';
            toDoItemHtml += '<div class="countdown-number">';
            toDoItemHtml += '<span class="days countdown-time"></span>';
            toDoItemHtml += '<span class="countdown-text">Днів</span>';
            toDoItemHtml += '</div>';
            toDoItemHtml += '<div class="countdown-number">';
            toDoItemHtml += '<span class="hours countdown-time"></span>';
            toDoItemHtml += '<span class="countdown-text">Годин</span>';
            toDoItemHtml += '</div>';
            toDoItemHtml += '<div class="countdown-number">';
            toDoItemHtml += '<span class="minutes countdown-time"></span>';
            toDoItemHtml += '<span class="countdown-text">Минут</span>';
            toDoItemHtml += '</div>';
            toDoItemHtml += '<div class="countdown-number">';
            toDoItemHtml += '<span class="seconds countdown-time"></span>';
            toDoItemHtml += '<span class="countdown-text">Секунд</span>';
            toDoItemHtml += '</div>';
            toDoItemHtml += '</div>';
            toDoItemHtml += '</div>';
        }
        toDoItemHtml += '<div class="button-wrapper">';
        toDoItemHtml += '<button class="button-done btn btn-primary" onclick="buttonStatus(`'+ id +'`, `'+ statusDone +'`, `'+ type +'`,`'+ deadline +'`)" role="button">'+ textStatusDone +'</button>';
        toDoItemHtml += '<button class="button-undone btn btn-primary" onclick="buttonStatus(`'+ id +'`, `'+ statusUnDone +'`, `'+ type +'`,`'+ deadline +'`);" role="button">'+ textStatusUnDone +'</button>';
        toDoItemHtml += '<button class="button-do btn btn-primary hidden" onclick="buttonStatus(`'+ id +'`, `'+ statusDo +'`, `'+ type +'`,`'+ deadline +'`);" role="button">'+ textStatusDo +'</button>';
    }
    toDoItemHtml += '<button class="button-remove btn btn-primary" onclick="buttonRemove(`'+ id +'`)" role="button">'+ textRemove +'</button>';
    toDoItemHtml += '</div>';
    toDoItemHtml += '</div>';

    toDoItem.innerHTML = toDoItemHtml;


//відображення заміток в необхідному блоці
    if (type == 'list') {
        if(listMessage) {
            listMessage.remove();
        }
        toDoWrapper.prepend(toDoItem);
    } else {
        if(eventMessage) {
            eventMessage.remove();
        }
        birthdayWrapper.prepend(toDoItem);
    }

    //приховання таймера залежно від статуса
    if (deadline != null) {
        let deadlineMessage = document.getElementById("deadline-message");
        initializeClock('countdown', deadline, id);
        if (status === statusDo && !deadlineMessage.classList.contains('visible')) {
            document.getElementById('countdown').className = "countdown";
            let t = getTimeRemaining(deadline);
            if (t.total > 0 && t.total < oneDay) {
                document.getElementById("countdown").classList.add('twinkle');
            }
        }
        else if (status === statusUnDone || status === statusDone) {
            document.getElementById('countdown').className = "hidden";
        }
        else if (deadlineMessage.classList.contains('visible')) {
            toDoUtility.unDoneToDo('to-do-' + id, statusUnDone, classUnDone)
        }
    }
// приховати кнопку 'активувати'
    if (status === statusUnDone || status === statusDone) {
        let buttonDo = document.body.querySelector('.button-do');
        buttonDo.classList.remove('hidden');
    }



    return null;

}

//вибір кнопки 'створити подію'
birthdayButton.onclick = function (){
    toDoItemWrapper.classList.toggle("birthday");
    let h1 = document.querySelector('h1');
    if ( toDoItemWrapper.classList.contains('birthday')) {
        h1.textContent = "Створити подію";
    } else  {
        h1.textContent = "Створити замітку";
    }
};

//вибір кнопки 'створити таймер'
timeButton.onclick = function (){
    toDoItemWrapper.classList.toggle("time_active");
};


//вибір кнопки 'створити'
createToDoItemButton.onclick = function (e) {
    e.preventDefault();

    let arr = {};
    let toDoItemWrapperBirthday =document.body.querySelector('.birthday');
    let titleVal = (title.value !== '') ? title.value : null;
    let descriptionVal = (description.value !== '') ? description.value : null;
    let hourVal =  hourInput.value;
    let minuteVal = minuteInput.value;
    let selectedMonth = (selectedDate.month) - 1;
    let deadline = new Date(selectedDate.year, selectedMonth, selectedDate.day, hourVal, minuteVal, 00, 0000 );



    if (titleVal !== null && descriptionVal !== null && !toDoItemWrapperBirthday ) {
        index++;
        arr = {'id': index, 'type': 'list', 'status': statusDo, 'title': titleVal, 'description': descriptionVal, 'time': null };
        if (toDoItemWrapper.classList.contains('time_active')) {
            arr.time = deadline;
        }

        toDoList.push(arr);
        updateToDoList();
        listBlock.classList.add('open');
        toDoItemWrapper.classList.remove('open');
        createToDo(arr);
    }
    else if (titleVal !== null  && toDoItemWrapperBirthday) {
        index++;
        arr = {'id': index, 'type': 'birthday', 'status': statusDo, 'title': titleVal, 'description': null, 'time': null };
        toDoEvent.push(arr);
        updateToDoList();
        birthdayBlock.classList.add('open');
        toDoItemWrapper.classList.remove('open');
        createToDo(arr);
    }


};

//вибір кнопки 'закрити'
сloseToDoItemButton.onclick = function (e) {
    e.preventDefault();

    toDoItemWrapper.classList.remove('open');
    listWrapper.classList.remove('open');
    calendarBlock.classList.remove('open_wrapper_list')
};

//розрахунок дистанції відліку
function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    let days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

//ініціалізація таймера
function initializeClock(idTimer, endtime, id) {
    let clock = document.getElementById(idTimer);
    let daysSpan = clock.querySelector(".days");
    let hoursSpan = clock.querySelector(".hours");
    let minutesSpan = clock.querySelector(".minutes");
    let secondsSpan = clock.querySelector(".seconds");
    let t = getTimeRemaining(endtime);
    let timeinterval = setInterval(updateClock, 1000);

    //запис таймера
    function updateClock() {
        let t = getTimeRemaining(endtime);

        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
        minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
        secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
        console.log(t);
        if (t.total == 0) {
            document.getElementById("countdown").className = "hidden";
            document.getElementById("deadline-message").className = "visible";
            toDoUtility.unDoneToDo('to-do-' + id, statusUnDone, classUnDone);
            clearInterval(timeinterval);
        }

        return true;
    }

    if (t.total <= 0) {
        console.log(t);
        document.getElementById("countdown").className = "hidden";
        document.getElementById("deadline-message").className = "visible";
    }
}

